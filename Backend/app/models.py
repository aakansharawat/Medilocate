from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_pharmacy = db.Column(db.Boolean, default=False)  # True for pharmacy accounts
    location = db.Column(db.String(100)) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    address = db.Column(db.String(300))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    
    inventory = db.relationship('Inventory', backref='pharmacy', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'is_pharmacy': self.is_pharmacy,
            'location': self.location,
            'created_at': self.created_at,
            'address': self.address,
            'latitude': self.latitude,
            'longitude': self.longitude
        }

class Medicine(db.Model):
    __tablename__ = 'medicines'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    manufacturer = db.Column(db.String(100))
    description = db.Column(db.String(255))

    # Relationship to Inventory
    inventories = db.relationship('Inventory', backref='medicine', lazy=True)

class Inventory(db.Model):
    __tablename__ = 'inventory'

    id = db.Column(db.Integer, primary_key=True)
    pharmacy_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    medicine_id = db.Column(db.Integer, db.ForeignKey('medicines.id'), nullable=False)  # <-- THIS LINE IS MANDATORY

    name = db.Column(db.String(100), nullable=False)
    manufacturer = db.Column(db.String(100))
    description = db.Column(db.String(255))
    stock = db.Column(db.Integer)
    price = db.Column(db.Float)
    expiry_date = db.Column(db.Date)
