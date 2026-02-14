
from uuid import uuid4

from sqlalchemy import text
from app.models.user import User
from app.models.user_database import UserDatabase
from app.db.engine import get_master_engine


class DataBaseLimitExceeded(Exception):
    pass

class DataBaseService:
    def __init__(self,db):
        self.db=db

    def create_database(self,user:User)->UserDatabase:
        allowed_limit=self._get_plan_limit(user.plan)

        if len(user.databases)>=allowed_limit:
            raise DataBaseLimitExceeded(f"User with plan {user.plan} can only create {allowed_limit} databases.")
        
        db_name=f"user_{user.id}_db_{uuid4().hex[:6]}"
        
        engine=get_master_engine()

        try:
            with engine.connect() as connection:
                connection.execute(text(f'CREATE DATABASE "{db_name}"'))
        except Exception as e:
            raise Exception(f"Failed to create database: {str(e)}")
        
        new_db=UserDatabase(name=db_name,owner_id=user.id)

        self.db.add(new_db)
        self.db.commit()
        self.db.refresh(new_db)

        return new_db
    
    def delete_database(self,user:User,db_id:int):
        db_record=self.db.query(UserDatabase).filter_by(id=db_id).first()

        if not db_record or db_record.owner_id!=user.id:
            raise Exception("Database not found or access denied.")
        
        engine=get_master_engine()

        try:
            with engine.connect() as connection:
                connection.execute(text(f'DROP DATABASE "{db_record.name}"'))
        except Exception as e:
            raise Exception(f"Failed to delete database: {str(e)}")
        
        self.db.delete(db_record)
        self.db.commit()
    
    def list_databases(self,user:User):
        return user.databases
    
    def _get_plan_limit(self,plan:str)->int:
        limits={
            "free":1,
            "pro":5,
            "enterprise":9999
        }
        return limits.get(plan,1)
