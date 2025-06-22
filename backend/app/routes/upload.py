from flask import Blueprint, request, jsonify
import csv
from flask_jwt_extended import jwt_required, get_jwt_identity
from io import StringIO
from datetime import datetime
from app.models import Medicine, Inventory, User
from app import db

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_inventory():
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()

    if not current_user or not current_user.is_pharmacy:
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if not file.filename.endswith('.csv'):
            return jsonify({'error': 'Invalid file format. Only CSV allowed.'}), 400

        import csv
        import io
        from app.models import Inventory

        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.DictReader(stream)

        for row in csv_input:
            new_item = Inventory(
                pharmacy_id=current_user.id,
                medicine_id=int(row.get('medicine_id', 0)),
                name=row.get('name'),
                manufacturer=row.get('manufacturer'),
                description=row.get('description'),
                stock=int(row.get('stock', 0)),
                price=float(row.get('price', 0)),
                expiry_date=datetime.strptime(row.get('expiry_date'), '%Y-%m-%d')
            )
            db.session.add(new_item)

        db.session.commit()
        return jsonify({'message': 'Inventory uploaded successfully'}), 201

    except Exception as e:
        import traceback
        print("CSV Upload Error:", str(e))
        traceback.print_exc()
        return jsonify({'error': 'Failed to process CSV'}), 500
