import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend"))

from app.db.engine import engine
from app.models.user import Base

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("All tables created successfully!")
