from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/send-otp", methods=["POST"])
def send_otp():
    """
    Send OTP to a phone number
    ---
    tags:
      - Authentication
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            phone:
              type: string
              example: "9876543210"
    responses:
      200:
        description: OTP sent successfully
        schema:
          type: object
          properties:
            message:
              type: string
              example: "OTP sent successfully"
      400:
        description: Invalid request
    """
    data = request.get_json()
    phone = data.get("phone")

    if not phone:
        return jsonify({"error": "Phone number required"}), 400

    # ✅ Here you would generate + send OTP
    return jsonify({"message": f"OTP sent to {phone}"}), 200
