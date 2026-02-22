from sqlalchemy import text


def get_schema_for_model(engine):
    with engine.connect() as conn:
        tables = conn.execute(text("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema='public'
        """)).fetchall()

        schema_text = ""

        for table in tables:
            table_name = table[0]

            columns = conn.execute(text("""
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_name=:table_name
            """), {"table_name": table_name}).fetchall()

            column_defs = ", ".join(
                [f"{col[0]} {col[1]}" for col in columns]
            )

            schema_text += f"CREATE TABLE {table_name} ({column_defs}); "

        return schema_text