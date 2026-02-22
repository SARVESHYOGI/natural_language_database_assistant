from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.engine import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    hash_password = Column(String, nullable=False)
    database_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())