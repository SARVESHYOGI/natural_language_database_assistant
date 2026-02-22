import os

import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration
from dotenv import load_dotenv

load_dotenv()
hf_token = os.getenv("HF_TOKEN")
MODEL_NAME = "cssupport/t5-small-awesome-text-to-sql"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME, token=hf_token)
model=T5ForConditionalGeneration.from_pretrained(MODEL_NAME, token=hf_token).to(device)

model.eval()

def generate_sql(schema_text:str,question:str):
    prompt=f"tables:\n{schema_text}\nquestion:\n{question}\nsql:"

    inputs=tokenizer(prompt, return_tensors="pt",truncation=True,padding=True).to(device)

    with torch.no_grad():
        outputs=model.generate(**inputs,max_length=256,num_beams=5,early_stopping=True)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)




