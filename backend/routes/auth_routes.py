from flask import Blueprint, request, jsonify
import random
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth", __name__)

# In-memory OTP store
OTP_STORE = {}

@auth_bp.route("/send-otp", methods=["POST"])
def send_otp():
    """
    Send OTP to user
    ---
    tags:
      - Auth
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            phone:
              type: string
              example: "7729931224"
    responses:
      200:
        description: OTP sent successfully
        examples:
          application/json: {
            "message": "OTP sent successfully",
            "otp": "123456"
          }
    """
    data = request.get_json()
    phone = data.get("phone")

    if not phone:
        return jsonify({"error": "Phone number is required"}), 400

    otp = str(random.randint(100000, 999999))
    OTP_STORE[phone] = otp

    # ⚠️ In production, integrate Twilio or other SMS API here
    return jsonify({"message": "OTP sent successfully", "otp": otp}), 200


@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    """
    Verify OTP
    ---
    tags:
      - Auth
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            phone:
              type: string
              example: "7729931224"
            otp:
              type: string
              example: "123456"
    responses:
      200:
        description: OTP verified successfully
        examples:
          application/json: {
            "message": "OTP verified",
            "access_token": "jwt-token-here"
          }
    """
    data = request.get_json()
    phone = data.get("phone")
    otp = data.get("otp")

    if OTP_STORE.get(phone) == otp:
        access_token = create_access_token(identity=phone)
        return jsonify({"message": "OTP verified", "access_token": access_token}), 200

    return jsonify({"error": "Invalid OTP"}), 400
