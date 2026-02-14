import sys
import os

# Add backend folder to path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.db.engine import master_engine, Base
from app.models import user

print("Creating database tables...")
Base.metadata.create_all(bind=master_engine)
print("All tables created successfully!")
