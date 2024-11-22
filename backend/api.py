from uuid import UUID

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import backend.indexer as indexer
import backend.searcher as searcher
import backend.models as models

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/index")
async def index():
    indexer.index()


@app.get("/product/{product_id}", response_model=models.ResponseProduct)
async def get_product(product_id: UUID):
    return searcher.get_product(product_id)


@app.post("/search", response_model=models.SearchResponse)
async def search(search_request: models.SearchRequest):
    return searcher.search(search_request)


@app.post("/recommend", response_model=models.RecommendResponse)
async def recommend(recommend_request: models.RecommendRequest):
    return searcher.recommend(recommend_request)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
