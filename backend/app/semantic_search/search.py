from .vector_client import QdrantClientWrapper
from .embedding import TextEmbeddingGenerator, ImageEmbeddingGenerator
import os

QDRANT_HOST = os.getenv("QDRANT_DB_HOST")
QDRANT_PORT = os.getenv("QDRANT_DB_PORT")
QDRANT_COLLECTION_NAME = os.getenv("QDRANT_DB_COLLECTION_NAME")
TEXT_EMBEDDING_MODEL = os.getenv("TEXT_EMBEDDING_MODEL")


vector_client = QdrantClientWrapper(host=QDRANT_HOST, port=QDRANT_PORT)

text_embedding_generator = TextEmbeddingGenerator(model_name=TEXT_EMBEDDING_MODEL)
image_embedding_generator = ImageEmbeddingGenerator()
