from sqlalchemy import text, inspect
from app.services.rag_service import build_index
from app.services.llm_service import generate_sql


def classify_query(sql: str):
    sql = sql.strip().lower()
    if sql.startswith("select"):
        return "read"
    return "mutation"


class QueryService:

    def __init__(self, engine, user_id: int):
        self.engine = engine
        self.user_id = user_id

    def execute(self, sql: str, confirm=False, question=None, schema=None):

        MAX_RETRIES = 2

        for attempt in range(MAX_RETRIES):

            sql = sql.strip()

            # Basic validation
            if not sql.lower().startswith((
                "select", "insert", "update",
                "delete", "create", "alter", "drop"
            )):
                return {
                    "status": "error",
                    "message": "Invalid SQL generated",
                    "generated_sql": sql
                }

            query_type = classify_query(sql)

            if query_type == "mutation" and not confirm:
                return {"status": "confirmation_required", "sql": sql}

            try:
                with self.engine.begin() as conn:
                    result = conn.execute(text(sql))

                    # Read query
                    if query_type == "read":
                        rows = result.fetchall()
                        cols = result.keys()
                        return [dict(zip(cols, r)) for r in rows]

                    # If CREATE TABLE → rebuild schema index
                    if sql.lower().startswith("create"):
                        inspector = inspect(self.engine)
                        tables = inspector.get_table_names()

                        schema_text = ""
                        for table in tables:
                            columns = inspector.get_columns(table)
                            col_str = ", ".join(
                                [f"{c['name']} {c['type']}" for c in columns]
                            )
                            schema_text += f"CREATE TABLE {table} ({col_str});\n"

                        build_index(schema_text, self.user_id)

                    return {"status": "success"}

            except Exception as e:

                # If max retries reached → fail
                if attempt == MAX_RETRIES - 1:
                    return {
                        "status": "error",
                        "message": str(e),
                        "generated_sql": sql
                    }

                # Ask LLM to fix the SQL
                correction_prompt = f"""
The following SQL generated an error:

SQL:
{sql}

Error:
{str(e)}

Schema:
{schema}

Original user question:
{question}

Fix the SQL. Return only corrected SQL.
"""

                sql = generate_sql(schema, correction_prompt)