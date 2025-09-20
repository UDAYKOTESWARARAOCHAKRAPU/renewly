from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import db, User
from datetime import datetime, timedelta
import random

auth_bp = Blueprint("auth", __name__)

# Temporary storage for OTPs (use Redis in production)
otp_store = {}

@auth_bp.route("/send-otp", methods=["POST"])
def send_otp():
    """
    Send OTP to user
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            phone_number:
              type: string
              example: "7729931224"
    responses:
      200:
        description: OTP sent
    """
    data = request.json
    phone_number = data.get("phone_number")

    if not phone_number:
        return jsonify({"msg": "Phone number is required"}), 400

    # Check if user exists
    user = User.query.filter_by(MobileNumber=phone_number).first()
    if not user:
        user = User(MobileNumber=phone_number, IsVerified=False, CreatedAt=datetime.now())
        db.session.add(user)
        db.session.commit()

    # Generate OTP
    otp = str(random.randint(100000, 999999))
    otp_store[phone_number] = otp

    # TODO: Integrate SMS API here
    print(f"DEBUG: OTP for {phone_number} is {otp}")

    return jsonify({"msg": f"OTP sent to {phone_number}"}), 200


@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    """
    Verify OTP and generate JWT token
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            phone_number:
              type: string
            otp:
              type: string
    responses:
      200:
        description: JWT token
    """
    data = request.json
    phone_number = data.get("phone_number")
    otp = data.get("otp")

    if otp_store.get(phone_number) != otp:
        return jsonify({"msg": "Invalid OTP"}), 400

    # Mark user as verified
    user = User.query.filter_by(MobileNumber=phone_number).first()
    if user:
        user.IsVerified = True
        db.session.commit()

    # Create JWT with UserID
    access_token = create_access_token(identity=user.UserID, expires_delta=timedelta(days=1))

    return jsonify({"access_token": access_token}), 200
