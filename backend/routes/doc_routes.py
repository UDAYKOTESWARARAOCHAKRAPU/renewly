from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import uuid

doc_bp = Blueprint("documents", __name__)

# In-memory document storage
documents = {}

def calculate_status(expiry_date):
    """Return 'valid' or 'expired' based on expiry_date (dd-mm-yyyy)."""
    try:
        exp_date = datetime.strptime(expiry_date, "%d-%m-%Y")
        return "expired" if exp_date < datetime.now() else "valid"
    except Exception:
        return "unknown"


@doc_bp.route("/documents", methods=["POST"])
@jwt_required()
def add_document():
    """
    Add a new document
    ---
    tags:
      - Documents
    security:
      - BearerAuth: []
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - title
            - expiry_date
          properties:
            title:
              type: string
              example: "Passport"
            expiry_date:
              type: string
              example: "18-09-2030"
            file_url:
              type: string
              example: "/uploads/passport.pdf"
    responses:
      201:
        description: Document added successfully
    """
    phone_number = get_jwt_identity()
    data = request.json

    if not data.get("title") or not data.get("expiry_date"):
        return jsonify({"msg": "Title and expiry_date are required"}), 400

    doc_id = str(uuid.uuid4())
    status = calculate_status(data["expiry_date"])

    document = {
        "id": doc_id,
        "title": data["title"],
        "expiry_date": data["expiry_date"],
        "file_url": data.get("file_url"),
        "status": status,
        "phone_number": phone_number
    }

    documents.setdefault(phone_number, []).append(document)

    return jsonify(document), 201


@doc_bp.route("/documents", methods=["GET"])
@jwt_required()
def get_documents():
    """
    Get all documents for the logged-in user
    ---
    tags:
      - Documents
    security:
      - BearerAuth: []
    responses:
      200:
        description: List of documents
    """
    phone_number = get_jwt_identity()
    return jsonify(documents.get(phone_number, [])), 200


@doc_bp.route("/documents/<doc_id>", methods=["PUT"])
@jwt_required()
def update_document(doc_id):
    """
    Update a document by ID
    ---
    tags:
      - Documents
    security:
      - BearerAuth: []
    consumes:
      - application/json
    parameters:
      - in: path
        name: doc_id
        type: string
        required: true
      - in: body
        name: body
        schema:
          type: object
          properties:
            title:
              type: string
            expiry_date:
              type: string
            file_url:
              type: string
    responses:
      200:
        description: Document updated
    """
    phone_number = get_jwt_identity()
    user_docs = documents.get(phone_number, [])

    for doc in user_docs:
        if doc["id"] == doc_id:
            data = request.json
            doc["title"] = data.get("title", doc["title"])
            doc["expiry_date"] = data.get("expiry_date", doc["expiry_date"])
            doc["file_url"] = data.get("file_url", doc.get("file_url"))
            doc["status"] = calculate_status(doc["expiry_date"])
            return jsonify(doc), 200

    return jsonify({"msg": "Document not found"}), 404


@doc_bp.route("/documents/<doc_id>", methods=["DELETE"])
@jwt_required()
def delete_document(doc_id):
    """
    Delete a document by ID
    ---
    tags:
      - Documents
    security:
      - BearerAuth: []
    parameters:
      - in: path
        name: doc_id
        type: string
        required: true
    responses:
      200:
        description: Document deleted
    """
    phone_number = get_jwt_identity()
    user_docs = documents.get(phone_number, [])

    for doc in user_docs:
        if doc["id"] == doc_id:
            user_docs.remove(doc)
            return jsonify({"msg": "Document deleted"}), 200

    return jsonify({"msg": "Document not found"}), 404
