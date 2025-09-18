from flask import Blueprint, request, jsonify
from database import db
from models import Document
from flasgger.utils import swag_from
from datetime import datetime

doc_bp = Blueprint("document", __name__)

@doc_bp.route("/documents/<int:user_id>", methods=["GET"])
@swag_from({
    'tags': ['Documents'],
    'description': 'Get all documents for a user'
})
def get_documents(user_id):
    docs = Document.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": d.id,
        "name": d.name,
        "type": d.type,
        "expiry": d.expiry.strftime("%d-%m-%Y"),
        "file_url": d.file_url
    } for d in docs])

@doc_bp.route("/documents", methods=["POST"])
@swag_from({
    'tags': ['Documents'],
    'description': 'Add a new document'
})
def add_document():
    data = request.get_json()
    doc = Document(
        name=data["name"],
        type=data["type"],
        expiry=datetime.strptime(data["expiry"], "%d-%m-%Y"),
        file_url=data.get("file_url"),
        user_id=data["user_id"]
    )
    db.session.add(doc)
    db.session.commit()
    return jsonify({"message": "Document added", "id": doc.id})
