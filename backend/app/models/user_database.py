from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.engine import Base


class UserDatabase(Base):
    __tablename__ = "user_databases"

    id = Column(Integer, primary_key=True)

    name = Column(String, unique=True, nullable=False)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="databases")
