import ollama
import re

MODEL_NAME = "phi3" 

def clean_sql_output(text: str):

    text = re.sub(r"```sql", "", text, flags=re.IGNORECASE)
    text = re.sub(r"```", "", text)

    text = text.split('---')[0]

    if ";" in text:
        text = text.split(";")[0] + ";"

    return text.strip()

def generate_sql(schema: str, question: str):

    prompt = f"""
You are a PostgreSQL expert.

STRICT RULES:
- Output only raw SQL.
- No markdown.
- No explanations.
- No comments.
- Only one SQL statement.

Schema:
{schema}

User request:
{question}

SQL:
"""

    response = ollama.chat(
        model="phi3",
        messages=[
            {"role": "system", "content": "Return only raw SQL."},
            {"role": "user", "content": prompt}
        ],
        options={
            "temperature": 0.1
        }
    )

    raw_sql = response["message"]["content"]

    return clean_sql_output(raw_sql)



# s=generate_sql("Table users(id int, name text);", "create table orders(id int, user_id int, amount float);")
# print(s)
