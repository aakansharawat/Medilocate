from app import create_app, db

# Create app instance
app = create_app()

# Use app context to initialize database
with app.app_context():
    db.create_all()
    print("Database tables created.")
