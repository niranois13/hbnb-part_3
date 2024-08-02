import os
from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import db, Config
from dotenv import load_dotenv
from routes import register_blueprints

load_dotenv()
host = os.environ.get('HOST')
port = int(os.environ.get('PORT', 5000))

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    app.config['UPLOAD_FOLDER'] = 'static/images'
    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    db.init_app(app)
    migrate = Migrate(app, db)

    # Setup the Flask-JWT-Extended extension
    app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET_KEY')
    jwt = JWTManager(app)
    # Set up Flask session password
    app.config["SECRET_KEY"] = os.environ.get('SECRET_KEY')

    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return jsonify({'Error': 'Missing Authorization Header'}), 401

    CORS(app, resources={r"/*": {"origins": "http://localhost"}}, supports_credentials=True)

    register_blueprints(app)
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=app.config['DEBUG'], host=host, port=port)
