from flask import Blueprint, jsonify, request, make_response, current_app
from models.users import User
from flask_jwt_extended import create_access_token, JWTManager
from flask_jwt_extended import get_jwt
login_api = Blueprint("login_api", __name__)
import os


@login_api.route('/api/login', methods=['POST'])
def login():
    """
    Function used to handle logins by comparing user entries (email/password)
    and calling the check_password method from the User class.
    :Returns: jsonify + message + error code on failure
    :Returns: jsonify + access token + success code on success
    """
    # Require data for login
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    # Query database for response
    user = User.query.filter_by(email=email).first()
    # Manage access token
    if user and user.check_password(user.password_hash, password):
        # Add role information to the token
        additional_claims = {"is_admin": user.is_admin}
        # Create user access token
        access_token = create_access_token(
            identity=user.id, additional_claims=additional_claims or {})
        resp = make_response(jsonify({"message": "Login successful"}))

        is_production = os.environ.get('FLASK_ENV', 'development') == 'production'

        cookie_options = {
            'httponly': True,
            'samesite': 'Strict'
        }
        if is_production:
            cookie_options['secure'] = True

        resp.set_cookie('jwtToken', access_token, **cookie_options)

        return resp
    else:
        return jsonify({"error": "Wrong email or password"}), 401


def admin_only():
    """
    Function used to handle admin claims.
    :Returns: boolean
    """
    claims = get_jwt()
    if claims.get("is_admin") is False:
        return False
    return True
