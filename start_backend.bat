@echo off
echo Starting MediLocate Backend...
echo.

cd backend

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo Initializing database...
python init_db.py

echo Seeding sample data...
python seed_data.py

echo Starting Flask server...
python run.py

pause 