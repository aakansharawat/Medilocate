from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Inventory, User, Medicine
import csv
from io import StringIO
from datetime import datetime

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/api/inventory/upload', methods=['POST'])
@jwt_required()
def upload_inventory():
    current_user_identity = get_jwt_identity()
    if not current_user_identity.get('is_pharmacy'):
        return jsonify({'error': 'Pharmacy access required'}), 403

    pharmacy_id = current_user_identity.get('user_id')

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Invalid file format. Please upload a CSV file.'}), 400

    stream = StringIO(file.stream.read().decode("UTF8"), newline=None)
    
    # Use a two-pass approach to handle new medicines
    # Pass 1: Discover all medicines and create new ones if they don't exist.
    
    # Cache existing medicines for quick lookup
    medicine_catalog = {m.name.lower(): m for m in Medicine.query.all()}
    new_medicines_to_add = {}
    
    # Rewind stream to read again for the first pass
    stream.seek(0)
    csv_for_pass1 = csv.DictReader(stream)

    rows_from_csv = list(csv_for_pass1) # Read all rows into memory

    for row in rows_from_csv:
        medicine_name = row.get('name')
        if not medicine_name:
            continue
        
        medicine_name_lower = medicine_name.lower()

        if medicine_name_lower not in medicine_catalog and medicine_name_lower not in new_medicines_to_add:
            new_medicines_to_add[medicine_name_lower] = Medicine(
                name=medicine_name,
                manufacturer=row.get('manufacturer'),
                description=row.get('description')
            )

    if new_medicines_to_add:
        db.session.add_all(new_medicines_to_add.values())
        db.session.flush() # Flush to get IDs for new medicines
        # Update catalog with the newly added medicines
        for med in new_medicines_to_add.values():
            medicine_catalog[med.name.lower()] = med

    # Pass 2: Create inventory items
    Inventory.query.filter_by(pharmacy_id=pharmacy_id).delete()
    errors = []
    new_inventory_items = []

    for i, row in enumerate(rows_from_csv):
        line_num = i + 2  # Header is line 1
        try:
            medicine_name = row['name']
            medicine = medicine_catalog.get(medicine_name.lower())

            if not medicine:
                # This should theoretically not happen due to the first pass
                errors.append(f"Line {line_num}: Could not find or create medicine '{medicine_name}'.")
                continue

            inventory_item = Inventory(
                pharmacy_id=pharmacy_id,
                medicine_id=medicine.id,
                name=medicine.name,
                manufacturer=row.get('manufacturer', medicine.manufacturer),
                description=row.get('description', medicine.description),
                stock=int(row['stock']),
                price=float(row['price']),
                expiry_date=datetime.strptime(row['expiry_date'], '%Y-%m-%d').date()
            )
            new_inventory_items.append(inventory_item)

        except KeyError as e:
            errors.append(f"Line {line_num}: Missing required column: {e}")
        except ValueError as e:
            errors.append(f"Line {line_num}: Invalid data format. Check numbers and dates. Details: {e}")
        except Exception as e:
            errors.append(f"Line {line_num}: An unexpected error occurred: {e}")
    
    if errors:
        db.session.rollback()
        return jsonify({'error': 'Upload failed with errors', 'details': errors}), 400

    try:
        db.session.add_all(new_inventory_items)
        db.session.commit()
        return jsonify({'message': f'Successfully uploaded {len(new_inventory_items)} inventory items.'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to save inventory to database', 'details': str(e)}), 500 