from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from app import db
from app.models import User
from app.utils.geocode_utils import geocode_address
from geopy.geocoders import Nominatim
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)
geolocator = Nominatim(user_agent="medilocate")

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    # Extract structured address fields
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    is_pharmacy = data.get('is_pharmacy', False)
    address_line = data.get('address_line')
    city = data.get('city')
    state = data.get('state')
    postal_code = data.get('postal_code')
    country = data.get('country')
    
    # Combine into a single address string for geocoding
    address = f"{address_line}, {city}, {state}, {postal_code}, {country}"

    if not all([name, email, password, address_line, city, state, postal_code, country]):
        return jsonify({'error': 'All fields are required'}), 400

    try:
        geolocator = Nominatim(user_agent="medilocate")
        location = geolocator.geocode(address)
        if not location:
            return jsonify({'error': 'Invalid address, could not geocode'}), 400

        hashed_password = generate_password_hash(password)
        new_user = User(
            name=name,
            email=email,
            password=hashed_password,
            is_pharmacy=is_pharmacy,
            address=address,
            latitude=location.latitude,
            longitude=location.longitude
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Email already registered'}), 409
    except Exception as e:
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500
    

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.email)
        return jsonify(access_token=access_token, user=user.to_dict()), 200
    
    return jsonify({"error": "Invalid credentials"}), 401


@auth_bp.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200

@auth_bp.route('/api/profile', methods=['DELETE'])
@jwt_required()
def delete_account():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404
        
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Account deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete account", "details": str(e)}), 500
