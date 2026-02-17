import faiss
import pickle
from sentence_transformers import SentenceTransformer
from sqlalchemy import inspect
from loguru import logger


class SchemaIndexer:
    def __init__(self, db_engine):
        self.engine = db_engine
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        self.index = None
        self.metadata = []

    def build_index(self, db_name: str):
        inspector = inspect(self.engine)

        tables = inspector.get_table_names()

        schema_chunks = []

        for table in tables:
            columns = inspector.get_columns(table)

            col_str = ", ".join(
                [f"{col['name']} ({col['type']})" for col in columns]
            )

            chunk = f"Database: {db_name}\nTable: {table}\nColumns: {col_str}"
            schema_chunks.append(chunk)

        embeddings = self.embedder.encode(schema_chunks)

        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(embeddings)

        self.metadata = schema_chunks

        logger.info("Schema index built successfully")

        with open("schema.index", "wb") as f:
            pickle.dump((self.index, self.metadata), f)
