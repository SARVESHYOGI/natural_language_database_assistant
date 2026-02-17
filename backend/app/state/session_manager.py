import json
import redis
from loguru import logger
from app.core.config import settings


class SessionManager:
    def __init__(self):
        self.redis = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            decode_responses=True
        )

    def get_session(self, session_id: str) -> dict:
        data = self.redis.get(session_id)

        if not data:
            logger.info(f"Creating new session: {session_id}")
            session = {
                "authenticated": True,
                "active_db": None,
                "available_dbs": []
            }
            self.redis.set(session_id, json.dumps(session))
            return session

        return json.loads(data)

    def update_session(self, session_id: str, session: dict):
        self.redis.set(session_id, json.dumps(session))

    def set_active_db(self, session_id: str, db_name: str):
        session = self.get_session(session_id)
        session["active_db"] = db_name
        self.update_session(session_id, session)
