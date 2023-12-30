import numpy as np
from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List
from app.semantic_search.embedding import TextEmbeddingGenerator, ImageEmbeddingGenerator


class QdrantClientWrapper:
    def __init__(self, host, port, collection_name,
                 text_embedding_generator: TextEmbeddingGenerator,
                 image_embedding_generator: ImageEmbeddingGenerator):
        self.collection_name = collection_name
        self.text_embedding_generator = text_embedding_generator
        self.image_embedding_generator = image_embedding_generator
        print(f"Connecting to Qdrant at {host}:{port}")
        self.client = QdrantClient(host=host, port=port)

    def init_collection(self, text_embedding_dim: int, image_embedding_dim: int):
        """
        Initialize used collection in the Qdrant vector database.
        """
        print(f"Collection {self.collection_name} does not exist. Initializing...")

        # config
        vectors_config = {
            "title": models.VectorParams(size=text_embedding_dim, distance=models.Distance.COSINE),
            "title_descr": models.VectorParams(size=text_embedding_dim, distance=models.Distance.COSINE),
            "image": models.VectorParams(size=image_embedding_dim, distance=models.Distance.DOT),
        }
        on_disk_payload = True

        # create collection
        _ = self.client.create_collection(
            collection_name=self.collection_name,
            vectors_config=vectors_config,
            on_disk_payload=on_disk_payload,
        )

        print(f"Collection {self.collection_name} created.")

    def __save_item_embeddings(self, collection_name, item_ids: List[int],
                               title_vectors:  List[np.ndarray],
                               title_descr_vectors:  List[np.ndarray],
                               image_vectors: List[np.ndarray]) -> models.UpdateResult:
        """
        Index data into the Qdrant vector database. If record with item_id already exists,
        it will be updated.

        Args:
            collection_name (str): The name of the collection to index into.
            item_ids (List[int]): A list of IDs corresponding to the items to index.
            title_vectors (np.ndarray): A NumPy array of text vectors to index.
            title_descr_vectors (np.ndarray): A NumPy array of text vectors to index.
            image_vectors (np.ndarray): Image vectors to index.
        """
        if not len(item_ids) == len(image_vectors) == len(title_vectors) == len(title_descr_vectors):
            raise ValueError("Length of item_ids and vectors must be equal.")

        result = self.client.upsert(
            collection_name=collection_name,
            points=models.Batch(
                ids=item_ids,
                vectors={
                    "title": title_vectors,
                    "title_descr": title_descr_vectors,
                    "image": image_vectors,
                },
                # payload=[{"item_id": item_id} for item_id in item_ids]
            )
        )
        return result

    def index_item(self, collection_name: str, item_id: int, item_name: str, item_name_descr: str,
                   image_url: str) -> models.UpdateResult:
        """
        Index a single item into the Qdrant vector database. If record with item_id already exists,
        it will be updated.

        Args:
            collection_name (str): The name of the collection to index into.
            item_id (int): The ID of the item to index.
            item_name (str): A text vector to index.
            item_name_descr (str): Item name and description concatenated to index.
            image_url (str): An image vector to index.
        """
        item_name_vec = self.text_embedding_generator.generate_embedding(item_name)
        item_name_descr_vec = self.text_embedding_generator.generate_embedding(item_name_descr)
        image_vec = self.image_embedding_generator.generate_embedding_from_image_url(image_url)
        result = self.__save_item_embeddings(
            collection_name=collection_name,
            item_ids=[item_id],
            title_vectors=[item_name_vec],
            title_descr_vectors=[item_name_descr_vec],
            image_vectors=[image_vec]
        )
        return result

    def index_items(self, collection_name: str, item_ids: List[int], item_names: List[str],
                    item_names_descr: List[str], image_urls: List[str]) -> models.UpdateResult:
        """
        Index a single item into the Qdrant vector database. If record with item_id already exists,
        it will be updated.

        Args:
            collection_name (str): The name of the collection to index into.
            item_ids (int): The inserted item IDs.
            item_names (List[str]): List of image names to index.
            item_names_descr (List[str]): List of item names and descriptions concatenated to index.
            image_urls (List[str]): List of image URLs to index.
        """
        item_name_vectors = self.text_embedding_generator.generate_embeddings_batch(item_names)
        item_name_descr_vectors = self.text_embedding_generator.generate_embeddings_batch(item_names_descr)
        image_vectors = self.image_embedding_generator.generate_embedding_from_image_url_batch(image_urls)
        result = self.__save_item_embeddings(
            collection_name=collection_name,
            item_ids=item_ids,
            title_vectors=item_name_vectors,
            title_descr_vectors=item_name_descr_vectors,
            image_vectors=image_vectors
        )
        return result

    def get_item(self, collection_name, item_ids: List[int]) -> List[models.Record]:
        """
        Get a single item from the Qdrant vector database.

        Args:
            collection_name (str): The name of the collection to get from.
            item_ids (int): The ID of the item to get.

        Returns:
            dict: A dictionary containing the item's ID, text
            vector, and image vector.
        """
        result = self.client.retrieve(
            collection_name=collection_name,
            ids=[item_ids]
        )
        return result

    def get_n_items(self, collection_name, n: int = -1, with_payload: bool = True,
                    with_vectors: bool = True):
        """
        Get n items from the Qdrant vector database.

        Args:
            collection_name (str): The name of the collection to get from.
            n (int): The number of items to get. If n = -1 then get all items.
            with_payload (bool): Whether to return the payload. Default is True.
            with_vectors (bool): Whether to return the vectors. Default is True.
        """
        items = self.client.scroll(
            collection_name=collection_name,
            scroll_filter=None,
            limit=n,
            with_payload=with_payload,
            with_vectors=with_vectors,
        )
        return items

    def delete_items(self, collection_name: str, item_ids: List[int]) -> models.UpdateResult:
        """
        Delete items from the Qdrant vector database.

        Args:
            collection_name (str): The name of the collection to delete from.
            item_ids (List[int]): A list of IDs corresponding to the items to delete.
        """
        result = self.client.delete(
            collection_name=collection_name,
            points_selector=models.PointIdsList(
                points=item_ids
            ),
        )
        return result

    def delete_item(self, collection_name: str, item_id: int) -> models.UpdateResult:
        """
        Delete a single item from the Qdrant vector database.
        """
        result = self.delete_items(collection_name, [item_id])
        return result

    def search(self, collection_name: str, query_vector: np.ndarray, search_type: str = "text", top_k=10):
        """
        Perform a semantic search in the Qdrant vector database.

        Args:
            collection_name (str): The name of the collection to search in.
            query_vector (list): The vector representing the query.
            top_k (int, optional): The number of top results to retrieve. Default is 10.
            search_type (str, optional): The type of search to perform. Available options: "image", "text".
                                        Default is "text".

        Returns:
            list: A list of IDs corresponding to the top-k search results.
        """
        # if search_type not in ["image", "text"]:
        #     raise ValueError("Invalid search type. Available options: 'image', 'text'.")

        hits = self.client.search(
            collection_name=collection_name,
            query_vector=models.NamedVector(
                name=search_type,
                vector=query_vector
            ),
            limit=top_k
        )
        # print(hits)
        # return id of items
        return [{"item_id": hit.id, "score": hit.score} for hit in hits]

    def list_collections(self) -> List[str]:
        """
        List all collections in the Qdrant vector database.

        Returns:
            list: A list of collection names.
        """
        return [collection.name for collection in self.client.get_collections().collections]

    def create_collection(self, collection_name: str, vectors_config: dict, on_disk_payload: bool = True) -> bool:
        """
        Create a collection in the Qdrant vector database.

        Args:
            collection_name (str): The name of the collection to create.
            vectors_config (dict): A dictionary containing the configuration for the vectors.
            on_disk_payload (bool, optional): Whether to store the vectors on disk. Default is True.

        Returns:
            bool: A response object containing the status of the creation.
        """
        result = self.client.create_collection(
            collection_name=collection_name,
            vectors_config=vectors_config,
            on_disk_payload=on_disk_payload,
        )
        return result

    def delete_collection(self, collection_name) -> bool:
        """
        Delete a collection from the Qdrant vector database.

        Args:
            collection_name (str): The name of the collection to delete.

        Returns:
            bool: A response object containing the status of the deletion.
        """
        result = self.client.delete_collection(collection_name=collection_name)
        return result
