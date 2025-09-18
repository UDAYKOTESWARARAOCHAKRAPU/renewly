from flask import Blueprint, request, jsonify
from database import db
from models import User
from flasgger.utils import swag_from

user_bp = Blueprint("user", __name__)

@user_bp.route("/profile/<int:user_id>", methods=["GET"])
@swag_from({
    'tags': ['User'],
    'description': 'Get user profile by ID',
    'responses': {200: {'description': 'User profile'}}
})
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"id": user.id, "full_name": user.full_name, "email": user.email, "mobile": user.mobile})

@user_bp.route("/profile", methods=["POST"])
@swag_from({
    'tags': ['User'],
    'description': 'Create or update user profile',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'schema': {
                'type': 'object',
                'properties': {
                    'full_name': {'type': 'string'},
                    'email': {'type': 'string'},
                    'mobile': {'type': 'string'}
                }
            }
        }
    ]
})
def save_profile():
    data = request.get_json()
    user = User.query.filter_by(mobile=data["mobile"]).first()
    if not user:
        user = User(mobile=data["mobile"])
    user.full_name = data.get("full_name")
    user.email = data.get("email")
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Profile saved", "id": user.id})
