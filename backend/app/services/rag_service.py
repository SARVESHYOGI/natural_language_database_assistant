from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
import os

embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def build_index(schema_text: str, user_id: int):
    docs = [Document(page_content=schema_text)]
    store = FAISS.from_documents(docs, embedding)

    path = f"storage/vector_indexes/user_{user_id}"
    os.makedirs(path, exist_ok=True)
    store.save_local(path)

def retrieve_schema(question: str, user_id: int):
    path = f"storage/vector_indexes/user_{user_id}"
    if not os.path.exists(path):
        return "No tables yet."
    store = FAISS.load_local(path, embedding, allow_dangerous_deserialization=True)
    docs = store.similarity_search_with_score(question, k=1)
    if not docs:
        return None, 0
    doc, score = docs[0]
    return doc.page_content, score