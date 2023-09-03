import numpy as np
from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List


class QdrantClientWrapper:
    def __init__(self, host, port):
        print(f"Connecting to Qdrant at {host}:{port}")
        self.client = QdrantClient(host=host, port=port)

    def index_items(self, collection_name, item_ids: List[int], text_vectors: List[np.ndarray],
                    image_vectors: List[np.ndarray]) -> models.UpdateResult:
        """
        Index data into the Qdrant vector database. If record with item_id already exists,
        it will be updated.

        Args:
            collection_name (str): The name of the collection to index into.
            item_ids (List[int]): A list of IDs corresponding to the items to index.
            text_vectors (np.ndarray): A NumPy array of text vectors to index.
            image_vectors (np.ndarray): Image vectors to index.
        """
        if not len(item_ids) == len(image_vectors) == len(text_vectors):
            raise ValueError("Length of item_ids and vectors must be equal.")

        result = self.client.upsert(
            collection_name=collection_name,
            points=models.Batch(
                ids=item_ids,
                vectors={
                    "image": image_vectors,
                    "text": text_vectors
                },
                # payload=[{"item_id": item_id} for item_id in item_ids]
            )
        )
        return result

    def index_item(self, collection_name, item_id: int, text_vector: np.ndarray,
                   image_vector: np.ndarray) -> models.UpdateResult:
        """
        Index a single item into the Qdrant vector database. If record with item_id already exists,
        it will be updated.

        Args:
            collection_name (str): The name of the collection to index into.
            item_id (int): The ID of the item to index.
            text_vector (np.ndarray): A text vector to index.
            image_vector (np.ndarray): An image vector to index.
        """
        result = self.index_items(
            collection_name=collection_name,
            item_ids=[item_id],
            text_vectors=[text_vector],
            image_vectors=[image_vector]
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

    def delete_items(self, collection_name, item_ids: List[int]) -> models.UpdateResult:
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
        if search_type not in ["image", "text"]:
            raise ValueError("Invalid search type. Available options: 'image', 'text'.")

        hits = self.client.search(
            collection_name=collection_name,
            query_vector=models.NamedVector(
                name=search_type,
                vector=query_vector
            ),
            limit=top_k
        )
        # return id of items
        return [hit.id for hit in hits]

    def list_collections(self):
        """
        List all collections in the Qdrant vector database.

        Returns:
            list: A list of collection names.
        """
        return self.client.get_collections()

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
