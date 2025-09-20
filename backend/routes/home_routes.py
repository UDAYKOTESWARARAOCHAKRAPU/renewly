from flask import Blueprint, jsonify
from models import db, Document
from datetime import datetime, timedelta

home_bp = Blueprint("home", __name__)

@home_bp.route("/<int:user_id>", methods=["GET"])
def home(user_id):
    """
    Home Page - Expired & Expiring Documents
    ---
    tags:
      - Home
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
        description: ID of the user whose documents are being fetched
    responses:
      200:
        description: Expired and expiring documents
        schema:
          type: object
          properties:
            expired_documents:
              type: array
              items:
                type: object
                properties:
                  DocumentID:
                    type: integer
                  Title:
                    type: string
                  DocType:
                    type: string
                  ExpiryDate:
                    type: string
                    format: date
            expiring_documents:
              type: array
              items:
                type: object
                properties:
                  DocumentID:
                    type: integer
                  Title:
                    type: string
                  DocType:
                    type: string
                  ExpiryDate:
                    type: string
                    format: date
    """
    today = datetime.today().date()
    thirty_days_from_now = today + timedelta(days=30)

    expired = Document.query.filter(
        Document.UserID == user_id, 
        Document.ExpiryDate < today
    ).all()

    expiring = Document.query.filter(
        Document.UserID == user_id,
        Document.ExpiryDate >= today,
        Document.ExpiryDate <= thirty_days_from_now
    ).all()

    expired_docs = [
        {
            "DocumentID": d.DocumentID,
            "Title": d.Title,
            "DocType": d.DocType,
            "ExpiryDate": d.ExpiryDate.isoformat()
        }
        for d in expired
    ]

    expiring_docs = [
        {
            "DocumentID": d.DocumentID,
            "Title": d.Title,
            "DocType": d.DocType,
            "ExpiryDate": d.ExpiryDate.isoformat()
        }
        for d in expiring
    ]

    return jsonify({
        "expired_documents": expired_docs,
        "expiring_documents": expiring_docs
    }), 200
