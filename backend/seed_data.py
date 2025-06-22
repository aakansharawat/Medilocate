from app import create_app, db
from app.models import User, Medicine, Inventory
from datetime import date, timedelta
import random
from werkzeug.security import generate_password_hash

app = create_app()

def seed_data():
    with app.app_context():
        # Clear existing data
        db.session.query(Inventory).delete()
        db.session.query(Medicine).delete()
        db.session.query(User).delete()
        db.session.commit()

        # Create sample pharmacies
        pharmacies = [
            {
                'name': 'City Center Pharmacy',
                'email': 'citycenter@pharmacy.com',
                'password': 'password123',
                'address': '123 Main Street, New York, NY 10001',
                'latitude': 40.7505,
                'longitude': -73.9934,
                'is_pharmacy': True
            },
            {
                'name': 'Downtown Medical',
                'email': 'downtown@medical.com',
                'password': 'password123',
                'address': '456 Broadway, New York, NY 10013',
                'latitude': 40.7205,
                'longitude': -74.0059,
                'is_pharmacy': True
            },
            {
                'name': 'Health Plus Pharmacy',
                'email': 'healthplus@pharmacy.com',
                'password': 'password123',
                'address': '789 5th Avenue, New York, NY 10065',
                'latitude': 40.7645,
                'longitude': -73.9745,
                'is_pharmacy': True
            },
            {
                'name': 'Dehradun Apollo Pharmacy',
                'email': 'apollo.dehradun@pharmacy.com',
                'password': 'password123',
                'address': 'Ballupur Chowk, Dehradun, Uttarakhand, 248001, India',
                'latitude': 30.3444,
                'longitude': 78.015,
                'is_pharmacy': True
            }
        ]

        pharmacy_users = []
        for pharmacy_data in pharmacies:
            hashed_password = generate_password_hash(pharmacy_data['password'])
            pharmacy = User(
                name=pharmacy_data['name'],
                email=pharmacy_data['email'],
                password=hashed_password,
                address=pharmacy_data['address'],
                latitude=pharmacy_data['latitude'],
                longitude=pharmacy_data['longitude'],
                is_pharmacy=pharmacy_data['is_pharmacy']
            )
            db.session.add(pharmacy)
            pharmacy_users.append(pharmacy)

        # Create sample medicines
        medicines = [
            {'name': 'Paracetamol', 'manufacturer': 'Generic Pharma', 'description': 'Pain reliever and fever reducer'},
            {'name': 'Ibuprofen', 'manufacturer': 'Pain Relief Inc', 'description': 'Anti-inflammatory pain medication'},
            {'name': 'Amoxicillin', 'manufacturer': 'Antibiotic Corp', 'description': 'Antibiotic for bacterial infections'},
            {'name': 'Metformin', 'manufacturer': 'Diabetes Care', 'description': 'Diabetes medication'},
            {'name': 'Atorvastatin', 'manufacturer': 'Heart Health', 'description': 'Cholesterol lowering medication'},
            {'name': 'Omeprazole', 'manufacturer': 'Digestive Health', 'description': 'Acid reflux medication'},
            {'name': 'Cetirizine', 'manufacturer': 'Allergy Relief', 'description': 'Antihistamine for allergies'},
            {'name': 'Dolo 650', 'manufacturer': 'Pain Management', 'description': 'Pain and fever medication'},
            {'name': 'Azithromycin', 'manufacturer': 'Antibiotic Plus', 'description': 'Broad spectrum antibiotic'},
            {'name': 'Montelukast', 'manufacturer': 'Respiratory Care', 'description': 'Asthma medication'}
        ]

        medicine_objects = []
        for med_data in medicines:
            medicine = Medicine(**med_data)
            db.session.add(medicine)
            medicine_objects.append(medicine)

        db.session.commit()

        # Create inventory for each pharmacy
        for pharmacy in pharmacy_users:
            for medicine in medicine_objects:
                # Random stock between 10 and 100
                stock = random.randint(10, 100)
                # Random price between 5 and 50
                price = round(random.uniform(5, 50), 2)
                # Random expiry date between 6 months and 2 years from now
                expiry_days = random.randint(180, 730)
                expiry_date = date.today() + timedelta(days=expiry_days)

                inventory = Inventory(
                    pharmacy_id=pharmacy.id,
                    medicine_id=medicine.id,
                    name=medicine.name,
                    manufacturer=medicine.manufacturer,
                    description=medicine.description,
                    stock=stock,
                    price=price,
                    expiry_date=expiry_date
                )
                db.session.add(inventory)

        db.session.commit()
        print("✅ Database seeded successfully!")
        print(f"Created {len(pharmacy_users)} pharmacies")
        print(f"Created {len(medicine_objects)} medicines")
        print(f"Created {len(pharmacy_users) * len(medicine_objects)} inventory items")

if __name__ == '__main__':
    seed_data() 