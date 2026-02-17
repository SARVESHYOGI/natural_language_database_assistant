import pickle
import faiss
from sentence_transformers import SentenceTransformer


class SchemaRetriever:
    def __init__(self):
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")

        with open("schema.index", "rb") as f:
            self.index, self.metadata = pickle.load(f)

    def retrieve(self, query: str, k: int = 3) -> str:
        query_vec = self.embedder.encode([query])
        distances, indices = self.index.search(query_vec, k)

        results = [self.metadata[i] for i in indices[0]]

        return "\n".join(results)
