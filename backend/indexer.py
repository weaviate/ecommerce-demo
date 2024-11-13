import json
import os

import weaviate.classes as wvc
from dotenv import load_dotenv
from loguru import logger

import connection
import models

load_dotenv()

client = connection.get_client()


def index():
    logger.info("Starting indexing run")

    data_path = "data/data.json"

    products = read_products_from_json(data_path)

    if client.collections.exists("Fashion"):
        logger.info("Deleting existing index")
        client.collections.delete("Fashion")
    logger.info("Creating collection")
    products_collection = create_collection()

    with products_collection.batch.dynamic() as batch:
        for product in products:
            batch.add_object(
                properties={
                    "product_id": product.product_id,
                    "name": product.name,
                    "description": product.description,
                    "category": product.category,
                    "subcategory": product.subcategory,
                    "collection": product.collection,
                    "price": product.price,
                    "image": product.image,
                    "colors": product.colors,
                    "rating": product.rating,
                    "brand": product.brand,
                    "tags": product.tags,
                    "reviews": product.reviews,
                },
                uuid=product.product_id,
            )

    if products_collection.batch.failed_objects:
        logger.error("Failed object")

    logger.info("Done")


def read_products_from_json(file_path):
    products = []
    with open(file_path, mode="r") as json_file:
        data = json.load(json_file)
        for product in data:
            image_url = (
                f"https://d3o574pyao1sq3.cloudfront.net/fashion/{product['id']}.png"
            )
            product = models.Product(
                product_id=product["id"],
                name=product["name"],
                description=product["description"],
                category=product["category"],
                subcategory=product["subcategory"],
                collection=product["collection"],
                price=float(product["price"]),
                image=str(image_url),
                colors=product["colors"],
                rating=float(product["rating"]),
                brand=product["brand"],
                tags=product["tags"],
                reviews=product["reviews"],
            )
            products.append(product)
    return products


def create_collection():
    vectorizer_config = None
    generative_config = None
    if "openai" == os.environ.get("PROVIDER"):
        vectorizer_config = wvc.config.Configure.Vectorizer.text2vec_openai()
        generative_config = wvc.config.Configure.Generative.openai()
    elif "cohere" == os.environ.get("PROVIDER"):
        vectorizer_config = wvc.config.Configure.Vectorizer.text2vec_cohere(
            model="embed-multilingual-v3.0"
        )
        generative_config = wvc.config.Configure.Generative.cohere()

    return client.collections.create(
        name="Fashion",
        vectorizer_config=vectorizer_config,
        generative_config=generative_config,
        properties=[
            wvc.config.Property(
                name="product_id",
                data_type=wvc.config.DataType.TEXT,
                skip_vectorization=True,
                index_filterable=False,
                index_searchable=False,
            ),
            wvc.config.Property(name="name", data_type=wvc.config.DataType.TEXT),
            wvc.config.Property(name="description", data_type=wvc.config.DataType.TEXT),
            wvc.config.Property(name="category", data_type=wvc.config.DataType.TEXT),
            wvc.config.Property(name="subcategory", data_type=wvc.config.DataType.TEXT),
            wvc.config.Property(name="collection", data_type=wvc.config.DataType.TEXT),
            wvc.config.Property(name="price", data_type=wvc.config.DataType.NUMBER),
            wvc.config.Property(
                name="image",
                data_type=wvc.config.DataType.TEXT,
                skip_vectorization=True,
                index_filterable=False,
                index_searchable=False,
            ),
            wvc.config.Property(
                name="colors", data_type=wvc.config.DataType.TEXT_ARRAY
            ),
            wvc.config.Property(name="rating", data_type=wvc.config.DataType.NUMBER),
            wvc.config.Property(name="brand", data_type=wvc.config.DataType.TEXT),
            wvc.config.Property(name="tags", data_type=wvc.config.DataType.TEXT_ARRAY),
            wvc.config.Property(
                name="reviews", data_type=wvc.config.DataType.TEXT_ARRAY
            ),
        ],
    )


if __name__ == "__main__":
    index()
    client.close()
