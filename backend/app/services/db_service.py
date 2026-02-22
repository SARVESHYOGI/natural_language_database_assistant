from uuid import uuid4
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from app.models.user_database import UserDatabase
from app.db.engine import get_master_engine
import re

class DataBaseLimitExceeded(Exception):
    pass

class InvalidDatabaseName(Exception):
    pass

class DataBaseService:
    DB_NAME_PATTERN = re.compile(r"^[a-zA-Z][a-zA-Z0-9_]{0,62}$")
    def __init__(self, db):
        self.db = db

    def create_database(self, user, custom_name: str):

        if not self.DB_NAME_PATTERN.match(custom_name):
            raise InvalidDatabaseName(
                "Invalid database name. Must start with a letter and contain only letters, numbers, and underscores (max 63 chars)."
            )

        db_name = f"user_{user.id}_{custom_name}"

        existing = (
            self.db.query(UserDatabase)
            .filter_by(name=db_name)
            .first()
        )

        if existing:
            raise Exception("Database with this name already exists.")

        master_engine = get_master_engine()

        try:
            with master_engine.connect() as connection:
                connection.execution_options(isolation_level="AUTOCOMMIT")
                connection.execute(text(f'CREATE DATABASE "{db_name}"'))
        except SQLAlchemyError as e:
            raise Exception(f"Failed to create database: {str(e)}")

        new_db = UserDatabase(name=db_name, owner_id=user.id)

        self.db.add(new_db)
        self.db.commit()
        self.db.refresh(new_db)

        return new_db

    def delete_database(self, user, db_id: int):
        db_record = self.db.query(UserDatabase).filter_by(id=db_id).first()

        if not db_record or db_record.owner_id != user.id:
            raise Exception("Database not found or access denied.")

        master_engine = get_master_engine()

        try:
            with master_engine.connect() as connection:
                connection.execution_options(isolation_level="AUTOCOMMIT")
                connection.execute(text(f'DROP DATABASE IF EXISTS "{db_record.name}"'))
        except SQLAlchemyError as e:
            raise Exception(f"Failed to delete database: {str(e)}")

        self.db.delete(db_record)
        self.db.commit()

    def list_databases(self, user):
        return user.databases

    def _get_plan_limit(self, plan: str) -> int:
        limits = {
            "free": 1,
            "pro": 5,
            "enterprise": 9999,
        }
        return limits.get(plan, 1)