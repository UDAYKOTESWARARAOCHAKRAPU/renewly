from flask import Blueprint, request, jsonify
from flasgger.utils import swag_from
from models import db, User

profile_bp = Blueprint("profile", __name__)

# ------------------ Get Profile ------------------
@profile_bp.route("/<int:user_id>", methods=["GET"])
@swag_from({
    "tags": ["Profile"],
    "description": "Fetch a user's profile by ID",
    "parameters": [
        {"name": "user_id", "in": "path", "type": "integer", "required": True, "description": "User ID"}
    ],
    "responses": {
        200: {
            "description": "User profile retrieved successfully",
            "examples": {
                "application/json": {
                    "UserID": 1,
                    "MobileNumber": "7729931224",
                    "Email": "test@mail.com",
                    "IsVerified": True,
                    "CreatedAt": "2025-09-18T12:34:56"
                }
            }
        },
        404: {"description": "User not found"}
    }
})
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "UserID": user.UserID,
        "MobileNumber": user.MobileNumber,
        "Email": user.Email,
        "IsVerified": user.IsVerified,
        "CreatedAt": user.CreatedAt.isoformat() if user.CreatedAt else None
    }), 200


# ------------------ Update Profile ------------------
@profile_bp.route("/<int:user_id>", methods=["PUT"])
@swag_from({
    "tags": ["Profile"],
    "description": "Update a user's profile information",
    "parameters": [
        {"name": "user_id", "in": "path", "type": "integer", "required": True, "description": "User ID"},
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "MobileNumber": {"type": "string", "example": "7729931224"},
                    "Email": {"type": "string", "example": "newmail@example.com"}
                }
            }
        }
    ],
    "responses": {
        200: {"description": "Profile updated successfully"},
        404: {"description": "User not found"}
    }
})
def update_profile(user_id):
    data = request.json
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if "MobileNumber" in data:
        user.MobileNumber = data["MobileNumber"]
    if "Email" in data:
        user.Email = data["Email"]

    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200


# ------------------ Delete Profile (Optional) ------------------
@profile_bp.route("/<int:user_id>", methods=["DELETE"])
@swag_from({
    "tags": ["Profile"],
    "description": "Delete a user profile by ID",
    "parameters": [
        {"name": "user_id", "in": "path", "type": "integer", "required": True, "description": "User ID"}
    ],
    "responses": {
        200: {"description": "Profile deleted successfully"},
        404: {"description": "User not found"}
    }
})
def delete_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Profile deleted successfully"}), 200
