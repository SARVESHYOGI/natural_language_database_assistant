from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from loguru import logger


class SQLExecutor:
    def __init__(self, db):
        self.db = db

    def execute(self, sql: str):
        try:
            result = self.db.execute(text(sql))

            if result.returns_rows:
                rows = result.fetchall()
                columns = result.keys()
                return {
                    "columns": list(columns),
                    "rows": [list(row) for row in rows]
                }

            self.db.commit()
            return {"message": "Query executed successfully"}

        except SQLAlchemyError as e:
            logger.error(f"SQL Execution Error: {e}")
            raise Exception("Database execution failed.")
