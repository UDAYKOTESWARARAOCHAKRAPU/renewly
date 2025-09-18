from flask import Flask
from flasgger import Swagger
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth_routes import auth_bp
from routes.profile_routes import profile_bp
from routes.doc_routes import doc_bp  
from routes.stats_profile import stats_bp

app = Flask(__name__)
app.config.from_object(Config)

# JWT setup
app.config["JWT_SECRET_KEY"] = "super-secret-key"  # ⚠️ change this in production
jwt = JWTManager(app)

# Swagger setup
swagger = Swagger(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(profile_bp, url_prefix="/api/profile")
app.register_blueprint(doc_bp, url_prefix="/api")   
app.register_blueprint(stats_bp, url_prefix="/api")

# Health check
@app.route("/api/health", methods=["GET"])
def health():
    """
    Health check endpoint
    ---
    tags:
      - Health
    responses:
      200:
        description: Service is running
    """
    return {"status": "running"}, 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
