from .vector_client import QdrantClientWrapper
from .embedding import TextEmbeddingGenerator, ImageEmbeddingGenerator
import os

QDRANT_HOST = os.getenv("QDRANT_DB_HOST")
QDRANT_PORT = os.getenv("QDRANT_DB_PORT")
QDRANT_COLLECTION_NAME = os.getenv("QDRANT_DB_COLLECTION_NAME")

TEXT_EMBEDDING_MODEL = os.getenv("TEXT_EMBEDDING_MODEL")
TEXT_EMBEDDING_DIM = int(os.getenv("TEXT_EMBEDDING_DIM"))
IMAGE_EMBEDDING_DIM = int(os.getenv("IMAGE_EMBEDDING_DIM"))

text_embedding_generator = TextEmbeddingGenerator(model_name=TEXT_EMBEDDING_MODEL)
image_embedding_generator = ImageEmbeddingGenerator()

vector_client = QdrantClientWrapper(
    host=QDRANT_HOST, port=QDRANT_PORT,
    collection_name=QDRANT_COLLECTION_NAME,
    text_embedding_generator=text_embedding_generator,
    image_embedding_generator=image_embedding_generator)

if QDRANT_COLLECTION_NAME not in vector_client.list_collections():
    vector_client.init_collection(text_embedding_dim=TEXT_EMBEDDING_DIM, image_embedding_dim=IMAGE_EMBEDDING_DIM)
