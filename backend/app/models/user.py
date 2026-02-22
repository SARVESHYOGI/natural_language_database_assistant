from sqlalchemy import Column,Integer, String , Boolean,DateTime,ForeignKey
from app.db.engine import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__="users"

    id=Column(Integer,primary_key=True,index=True)

    username=Column(String,unique=True,index=True)
    email=Column(String,unique=True,index=True)
    
    hash_password=Column(String,nullable=False)

    plan=Column(String,default="free",nullable=False)

    db_count=Column(Integer,default=0)

    is_active=Column(Boolean,default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    active_db_id = Column(Integer, ForeignKey("user_databases.id"), nullable=True)

    active_db = relationship(
        "UserDatabase",
        foreign_keys=[active_db_id]
    )

    databases = relationship("UserDatabase", back_populates="owner",foreign_keys="UserDatabase.owner_id")
