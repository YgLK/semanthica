import meilisearch.index
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db, get_meili_index

from ..semantic_search import (vector_client,
                               text_embedding_generator,
                               image_embedding_generator,
                               QDRANT_COLLECTION_NAME)

from ..utils import ImageTool

router = APIRouter(
    prefix="/search",
    tags=["Semantic search"],
)


def get_item(db: Session, item_id: int) -> models.Item:
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return item


@router.post(
    "/classic", status_code=status.HTTP_201_CREATED, response_model=List[schemas.ItemOut]
)
async def search_text(search_request: schemas.SearchQueryText,
                      items_index: meilisearch.index.Index = Depends(get_meili_index),
                      db: Session = Depends(get_db)):
    # https://www.meilisearch.com/docs/reference/api/search
    result = items_index.search(
        search_request.text_query,
        {
            'matchingStrategy': 'all',
            'limit': search_request.top_k
        }
    )

    res_items = []
    for hit in result['hits']:
        item = get_item(db, hit['id'])
        res_items.append(item.__dict__)

    return res_items


@router.post(
    "/text", status_code=status.HTTP_201_CREATED, response_model=schemas.SearchResponse
)
async def search_text(search_request: schemas.SearchQueryText, db: Session = Depends(get_db)):
    query_embedding = text_embedding_generator.generate_embedding(search_request.text_query)
    res_items = vector_client.search(
        collection_name=QDRANT_COLLECTION_NAME,
        query_vector=query_embedding,
        search_type="text",
        top_k=search_request.top_k,
    )

    for res_item in res_items:
        item = get_item(db, res_item["item_id"])
        res_item["content"] = item.__dict__

    return schemas.SearchResponse(items=res_items)


@router.post(
    "/image", status_code=status.HTTP_201_CREATED, response_model=schemas.SearchResponse
)
async def search_image(search_request: schemas.SearchQueryImage, db: Session = Depends(get_db)):
    query_image = ImageTool.load_image_from_url(search_request.image_url)
    query_embedding = image_embedding_generator.generate_embedding_from_image_data(query_image)
    res_items = vector_client.search(
        collection_name=QDRANT_COLLECTION_NAME,
        query_vector=query_embedding,
        search_type="image",
        top_k=search_request.top_k,
    )

    for res_item in res_items:
        item = get_item(db, res_item["item_id"])
        res_item["content"] = item.__dict__

    return schemas.SearchResponse(items=res_items)
