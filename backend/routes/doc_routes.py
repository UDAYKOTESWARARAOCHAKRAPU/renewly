from flask import Blueprint, request, jsonify
from flasgger.utils import swag_from
from models import db, Document
from datetime import datetime

document_bp = Blueprint("documents", __name__)

# ------------------ Add Document ------------------
@document_bp.route("/", methods=["POST"])
@swag_from({
    "tags": ["Documents"],
    "description": "Add a new document for a user",
    "parameters": [
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "UserID": {"type": "integer", "example": 1},
                    "Title": {"type": "string", "example": "Driving License"},
                    "DocType": {"type": "string", "example": "License"},
                    "ExpiryDate": {"type": "string", "example": "2025-12-31"},
                    "Notes": {"type": "string", "example": "Renew before expiry"},
                    "FilePath": {"type": "string", "example": "/uploads/license.pdf"}
                },
                "required": ["UserID", "Title", "DocType", "ExpiryDate"]
            }
        }
    ],
    "responses": {
        201: {"description": "Document created successfully"},
        400: {"description": "Invalid input"}
    }
})
def add_document():
    data = request.json
    new_doc = Document(
        UserID=data["UserID"],
        Title=data["Title"],
        DocType=data["DocType"],
        ExpiryDate=datetime.strptime(data["ExpiryDate"], "%Y-%m-%d"),
        Notes=data.get("Notes"),
        FilePath=data.get("FilePath")
    )
    db.session.add(new_doc)
    db.session.commit()

    return jsonify({"message": "Document added successfully", "DocumentID": new_doc.DocumentID}), 201


# ------------------ Get Document ------------------
@document_bp.route("/<int:doc_id>", methods=["GET"])
@swag_from({
    "tags": ["Documents"],
    "description": "Get document details by ID",
    "parameters": [
        {"name": "doc_id", "in": "path", "type": "integer", "required": True, "description": "Document ID"}
    ],
    "responses": {
        200: {"description": "Document found"},
        404: {"description": "Document not found"}
    }
})
def get_document(doc_id):
    doc = Document.query.get(doc_id)
    if not doc:
        return jsonify({"error": "Document not found"}), 404

    return jsonify({
        "DocumentID": doc.DocumentID,
        "Title": doc.Title,
        "DocType": doc.DocType,
        "ExpiryDate": doc.ExpiryDate.isoformat(),
        "Notes": doc.Notes,
        "FilePath": doc.FilePath,
        "CreatedAt": doc.CreatedAt
    }), 200


# ------------------ Update Document ------------------
@document_bp.route("/<int:doc_id>", methods=["PUT"])
@swag_from({
    "tags": ["Documents"],
    "description": "Update an existing document by ID",
    "parameters": [
        {"name": "doc_id", "in": "path", "type": "integer", "required": True, "description": "Document ID"},
        {
            "name": "body",
            "in": "body",
            "schema": {
                "type": "object",
                "properties": {
                    "Title": {"type": "string", "example": "Updated License"},
                    "DocType": {"type": "string", "example": "ID"},
                    "ExpiryDate": {"type": "string", "example": "2026-01-15"},
                    "Notes": {"type": "string", "example": "Keep safe"},
                    "FilePath": {"type": "string", "example": "/uploads/updated_license.pdf"}
                }
            }
        }
    ],
    "responses": {
        200: {"description": "Document updated successfully"},
        404: {"description": "Document not found"}
    }
})
def update_document(doc_id):
    data = request.json
    doc = Document.query.get(doc_id)

    if not doc:
        return jsonify({"error": "Document not found"}), 404

    if "Title" in data:
        doc.Title = data["Title"]
    if "DocType" in data:
        doc.DocType = data["DocType"]
    if "ExpiryDate" in data:
        doc.ExpiryDate = datetime.strptime(data["ExpiryDate"], "%Y-%m-%d")
    if "Notes" in data:
        doc.Notes = data["Notes"]
    if "FilePath" in data:
        doc.FilePath = data["FilePath"]

    db.session.commit()
    return jsonify({"message": "Document updated successfully"}), 200


# ------------------ Delete Document ------------------
@document_bp.route("/<int:doc_id>", methods=["DELETE"])
@swag_from({
    "tags": ["Documents"],
    "description": "Delete a document by ID",
    "parameters": [
        {"name": "doc_id", "in": "path", "type": "integer", "required": True, "description": "Document ID"}
    ],
    "responses": {
        200: {"description": "Document deleted successfully"},
        404: {"description": "Document not found"}
    }
})
def delete_document(doc_id):
    doc = Document.query.get(doc_id)
    if not doc:
        return jsonify({"error": "Document not found"}), 404

    db.session.delete(doc)
    db.session.commit()
    return jsonify({"message": "Document deleted successfully"}), 200
