class SQLChain:
    def __init__(self):
        pass

    def generate_sql(self, message: str, schema_context: str, active_db: str):

        prompt = f"""
                You are a strict SQL generator.

                Rules:
                - Use ONLY tables and columns listed below.
                - If a table does not exist, say TABLE_NOT_FOUND.
                - Never invent schema.

                Active Database:
                {active_db}

                Schema:
                {schema_context}

                User Request:
                {message}

                Return ONLY SQL.
                """

        sql = self._call_llm(prompt)
        return sql.strip()

    def explain_result(self, message, sql, result):

        prompt = f"""
            User asked: {message}
            SQL executed: {sql}
            Result: {result}

            Explain the result in natural language.
        """
        return self._call_llm(prompt)

    def _call_llm(self, prompt):
        return "SELECT COUNT(*) FROM users;"
