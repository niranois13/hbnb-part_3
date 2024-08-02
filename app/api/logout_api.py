from flask import Blueprint, jsonify, request, make_response
from flask_jwt_extended import create_access_token, JWTManager, get_jwt, jwt_required, get_jwt_identity, unset_jwt_cookies
from config import Config, db
from sqlalchemy.orm import sessionmaker
logout_api = Blueprint("logout_api", __name__)

Session = sessionmaker(bind=Config.engine)
session = Session()


@logout_api.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    resp = jsonify({'success': True})
    unset_jwt_cookies(resp)
    session.clear()
    return resp, 200
