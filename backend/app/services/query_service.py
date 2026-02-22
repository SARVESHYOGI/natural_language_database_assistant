FORBIDDEN_KEYWORDS = ["drop database", "grant", "revoke"]

def classify_query(sql: str):
    sql_lower = sql.strip().lower()

    if any(keyword in sql_lower for keyword in FORBIDDEN_KEYWORDS):
        raise Exception("Dangerous query detected.")

    if sql_lower.startswith("select"):
        return "read"

    return "mutation"