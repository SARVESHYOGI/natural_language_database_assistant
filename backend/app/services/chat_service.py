from sqlalchemy.orm import Session
from app.state.session_manager import SessionManager
from app.rag.retriever import SchemaRetriever
from app.chains.intent_chain import IntentChain
from app.chains.sql_chain import SQLChain
from app.chains.permission_chain import PermissionChain
from app.executor import SQLExecutor


class ChatService:

    def __init__(self, db, llm):
        self.db = db
        self.llm = llm
        self.session = SessionManager()
        self.retriever = SchemaRetriever()
        self.permission = PermissionChain()
        self.executor = SQLExecutor(db)

    def handle_message(self, message: str, session_id: str):

        session = self.session.get_session(session_id)

        if not session["active_db"]:
            return {
                "status": "error",
                "explanation": "No active database selected."
            }

        schema_context = self.retriever.retrieve(message)

        prompt = f"""
                    Use ONLY the schema below.

                    Schema:
                    {schema_context}

                    User Request:
                    {message}

                    Return ONLY SQL.
                    """

        sql = self.llm.generate(prompt)

        permission = self.permission.classify(sql)

        if permission == "BLOCKED":
            return {"status": "blocked", "explanation": "Query blocked."}

        if permission == "CONFIRM_REQUIRED":
            return {
                "status": "confirmation_required",
                "sql": sql
            }

        result = self.executor.execute(sql)

        explanation = self.llm.generate(
            f"Explain this result:\n{result}"
        )

        return {
            "status": "success",
            "data": result,
            "explanation": explanation
        }
