import ollama
import os
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()


api_key = os.getenv("GENAI_API_KEY")
if not api_key:
    raise ValueError("GENAI_API_KEY not found in environment variables.")
client = genai.Client(api_key=api_key)


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

    # response = ollama.chat(
    #     model="phi3",
    #     messages=[
    #         {"role": "system", "content": "Return only raw SQL."},
    #         {"role": "user", "content": prompt}
    #     ],
    #     options={
    #         "temperature": 0.1
    #     }
    # )
    # raw_sql = response["message"]["content"]

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,  # ✅ list of Content
        config=types.GenerateContentConfig(
            system_instruction="Return only raw SQL.",
            temperature=0.1
        )
    )
    raw_sql = response.text
    
    
    return clean_sql_output(raw_sql)



# s=generate_sql("Table users(id int, name text);", "create table orders(id int, user_id int, amount float);")
# print(s)
