from flask import Flask, render_template, session, redirect, url_for
from flask_swagger_ui import get_swaggerui_blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from api.amenities_api import amenities_api
from api.cities_api import cities_api
from api.country_api import country_api
from api.place_api import place_api
from api.review_api import review_api
from api.user_api import user_api
from api.login_api import login_api
from api.logout_api import logout_api

def get_current_user():
    try:
        verify_jwt_in_request(optional=True)
        return get_jwt_identity()
    except:
        return None

def register_blueprints(app: Flask):
    """
    Function to register all blueprints for the application.
    """
    @app.route('/')
    def index():
        current_user = get_current_user()
        return render_template('index.html', current_user=current_user)

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        current_user = get_current_user()
        return render_template('login.html', current_user=current_user)


    # Setup Swagger UI
    SWAGGER_URL = '/api/docs'
    API_URL = '/static/swagger.json'
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={'app_name': "Test application"}
    )
    app.register_blueprint(swaggerui_blueprint)

    app.register_blueprint(amenities_api)
    app.register_blueprint(cities_api)
    app.register_blueprint(country_api)
    app.register_blueprint(place_api)
    app.register_blueprint(review_api)
    app.register_blueprint(user_api)
    app.register_blueprint(login_api)
    app.register_blueprint(logout_api)
