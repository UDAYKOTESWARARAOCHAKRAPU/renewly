from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

profile_bp = Blueprint("profile", __name__)

# In-memory profiles (replace with DB later)
profiles = {
    "7729931224": {   # phone_number as key (since it's used for login)
        "name": "Uday Koteswara Rao",
        "email": "project.uday20@gmail.com",
        "phone_number": "7729931224"
    }
}


@profile_bp.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    """
    Get user profile
    ---
    tags:
      - Profile
    security:
      - BearerAuth: []
    responses:
      200:
        description: User profile data
        schema:
          type: object
          properties:
            name:
              type: string
            email:
              type: string
            phone_number:
              type: string
    """
    phone_number = get_jwt_identity()
    profile = profiles.get(phone_number)

    if not profile:
        return jsonify({"msg": "Profile not found"}), 404

    return jsonify(profile), 200


@profile_bp.route("/me", methods=["POST"])
@jwt_required()
def update_profile():
    """
    Update user profile
    ---
    tags:
      - Profile
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
            - name
          properties:
            name:
              type: string
              example: "New Name"
            email:
              type: string
              example: "newemail@example.com"
    responses:
      200:
        description: Updated profile
        schema:
          type: object
          properties:
            name:
              type: string
            email:
              type: string
            phone_number:
              type: string
    """
    phone_number = get_jwt_identity()
    data = request.json

    if phone_number not in profiles:
        return jsonify({"msg": "Profile not found"}), 404

    # Update fields
    profiles[phone_number]["name"] = data.get("name", profiles[phone_number]["name"])
    profiles[phone_number]["email"] = data.get("email", profiles[phone_number].get("email"))

    return jsonify(profiles[phone_number]), 200


@profile_bp.route("/me", methods=["DELETE"])
@jwt_required()
def delete_profile():
    """
    Delete user profile
    ---
    tags:
      - Profile
    security:
      - BearerAuth: []
    responses:
      200:
        description: Profile deleted
        schema:
          type: object
          properties:
            msg:
              type: string
    """
    phone_number = get_jwt_identity()
    if phone_number in profiles:
        del profiles[phone_number]
        return jsonify({"msg": "Profile deleted"}), 200
    return jsonify({"msg": "Profile not found"}), 404
