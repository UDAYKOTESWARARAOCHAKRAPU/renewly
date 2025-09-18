from flask import Flask
from flasgger import Swagger
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth_routes import auth_bp

app = Flask(__name__)
app.config.from_object(Config)

# JWT setup
app.config["JWT_SECRET_KEY"] = "super-secret-key"  # change this in production
jwt = JWTManager(app)

# Swagger
swagger = Swagger(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")

@app.route("/api/health", methods=["GET"])
def health():
    return {"status": "running"}, 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
