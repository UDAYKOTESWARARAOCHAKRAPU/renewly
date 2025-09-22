from flask import Flask
from flasgger import Swagger
from flask_jwt_extended import JWTManager
from config import Config
from database import db   # Your SQLAlchemy db instance
from flask_cors import CORS

# Import blueprints
from routes.auth_routes import auth_bp
from routes.profile_routes import profile_bp
from routes.doc_routes import document_bp
from routes.stats_profile import stats_bp
from routes.home_routes import home_bp

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # Enable CORS for all routes

# Initialize DB
db.init_app(app)

# JWT setup
app.config["JWT_SECRET_KEY"] = Config.SECRET_KEY
jwt = JWTManager(app)

# Swagger setup
swagger = Swagger(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(profile_bp, url_prefix="/api/profile")
app.register_blueprint(document_bp, url_prefix="/api/documents")
app.register_blueprint(stats_bp, url_prefix="/api/stats")
app.register_blueprint(home_bp, url_prefix="/api/home")

# Health check
@app.route("/api/health", methods=["GET"])
def health():
    return {"status": "running"}, 200

# Run app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables in SQL Server
    app.run(debug=True, port=5000)
