from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from database import db

stats_bp = Blueprint("stats", __name__)

@stats_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    """
    Get document statistics (valid, expired, expiring soon, total)
    ---
    tags:
      - Stats
    responses:
      200:
        description: Document statistics for the logged-in user
        schema:
          type: object
          properties:
            total:
              type: integer
              example: 5
            valid:
              type: integer
              example: 3
            expired:
              type: integer
              example: 1
            expiring_soon:
              type: integer
              example: 1
    """
    current_user = get_jwt_identity()
    documents = db["documents"].get(current_user, [])

    total = len(documents)
    valid = 0
    expired = 0
    expiring_soon = 0

    today = datetime.today().date()
    soon_threshold = today + timedelta(days=30)

    for doc in documents:
        expiry_date = datetime.strptime(doc["expiry_date"], "%Y-%m-%d").date()
        if expiry_date < today:
            expired += 1
        elif today <= expiry_date <= soon_threshold:
            expiring_soon += 1
        else:
            valid += 1

    return jsonify({
        "total": total,
        "valid": valid,
        "expired": expired,
        "expiring_soon": expiring_soon
    }), 200
