from flask import Blueprint, jsonify
from flasgger.utils import swag_from
from models import Document
from datetime import datetime, timedelta

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/", methods=["GET"])
@swag_from({
    "responses": {
        200: {
            "description": "Fetch document statistics from the database",
            "examples": {
                "application/json": {
                    "total_documents": 10,
                    "valid_documents": 5,
                    "expiring_documents": 3,
                    "expired_documents": 2
                }
            }
        }
    }
})
def get_stats():
    """
    Get statistics about documents:
    - Total documents
    - Expired documents (ExpiryDate < today)
    - Expiring soon (ExpiryDate within 30 days)
    - Valid documents (ExpiryDate > 30 days)
    """
    today = datetime.today().date()
    thirty_days_from_now = today + timedelta(days=30)

    # Query the database using your Document model
    total_docs = Document.query.count()
    expired_docs = Document.query.filter(Document.ExpiryDate < today).count()
    expiring_docs = Document.query.filter(
        Document.ExpiryDate >= today,
        Document.ExpiryDate <= thirty_days_from_now
    ).count()
    valid_docs = Document.query.filter(Document.ExpiryDate > thirty_days_from_now).count()

    return jsonify({
        "total_documents": total_docs,
        "valid_documents": valid_docs,
        "expiring_documents": expiring_docs,
        "expired_documents": expired_docs
    }), 200
