def classify_query(sql: str):
    sql = sql.strip().lower()

    if sql.startswith("select"):
        return "read"

    if sql.startswith(("insert", "update", "delete", "create", "alter", "drop", "truncate")):
        return "mutation"

    raise Exception("Unsupported query type")