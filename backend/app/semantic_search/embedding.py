import numpy as np
from typing import List, Union
from sentence_transformers import SentenceTransformer
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.applications.resnet50 import preprocess_input


class TextEmbeddingGenerator:
    def __init__(self, model_name: str):
        # Load the model
        self.model = SentenceTransformer(model_name)

    def generate_embedding(self, text: Union[str, List[str]]):
        """
        Generate a text embedding for a single text or a list of texts.

        Args:
            text (Union[str, List[str]]): Input text or a list of texts.

        Returns:
            np.ndarray: Text embedding as a NumPy array.
        """
        return self.model.encode(text)

    def generate_embeddings_batch(self, texts: List[str]):
        """
        Generate text embeddings for a batch of texts.

        Args:
            texts (List[str]): List of input texts.

        Returns:
            List[np.ndarray]: List of text embeddings as NumPy arrays.
        """
        return self.model.encode(texts)


class ImageEmbeddingGenerator:
    def __init__(self):
        # vec dim = 2048 - it might need to be reduced to save memory
        self.model = ResNet50(weights="imagenet", include_top=False, pooling='avg')

    def generate_embedding(self, image: np.ndarray):
        """
        Generate an image embedding for a single image.

        Args:
            image (np.ndarray): Input image as a NumPy array.

        Returns:
            np.ndarray: Image embedding as a NumPy array.
        """
        # Preprocess the image and compute the embedding
        image = preprocess_input(image)
        image_embedding = self.model.predict(np.expand_dims(image, axis=0))
        return image_embedding[0]

    def generate_embeddings_batch(self, images: List[np.ndarray]):
        """
        Generate image embeddings for a batch of images.

        Args:
            images (List[np.ndarray]): List of input images as NumPy arrays.

        Returns:
            List[np.ndarray]: List of image embeddings as NumPy arrays.
        """
        # Preprocess all images and compute the embeddings
        preprocessed_images = [preprocess_input(image) for image in images]
        image_embeddings = self.model.predict(np.array(preprocessed_images))
        return image_embeddings
