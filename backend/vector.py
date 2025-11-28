# backend/vector.py
import os
from typing import List, Dict, Any

import weaviate
from sentence_transformers import SentenceTransformer

WEAVIATE_URL = os.getenv( "http://localhost:8090")

# initialize client lazily so import doesn't crash if Weaviate is down
def _init_client():
    try:
        # pass url explicitly
        client = weaviate.Client(url=WEAVIATE_URL)
        # quick ping
        _ = client.is_ready()  # returns True/False or raises
        return client
    except Exception as e:
        # raise but keep it informative for higher-level code to handle.
        raise RuntimeError(f"Could not connect to Weaviate at {WEAVIATE_URL}: {e}")

# Embedding model (load once)
try:
    model = SentenceTransformer("all-MiniLM-L6-v2")
except Exception as e:
    # If model fails to load, raise with helpful instruction
    raise RuntimeError("Failed to load embedding model 'all-MiniLM-L6-v2'. "
                       "Ensure sentence-transformers is installed and you have internet to download the model: " + str(e))

def init_schema() -> None:
    client = _init_client()
    # define property schema for the class
    html_chunk_class = {
        "class": "HtmlChunk",
        "vectorizer": "none",
        "properties": [
            {"name": "url", "dataType": ["text"]},
            {"name": "text", "dataType": ["text"]},
            {"name": "chunk_index", "dataType": ["int"]},
            {"name": "start_token", "dataType": ["int"]},
            {"name": "end_token", "dataType": ["int"]}
        ],
    }

    existing = client.schema.get()
    existing_classes = [c.get("class") for c in existing.get("classes", [])] if existing else []
    if "HtmlChunk" not in existing_classes:
        # create class in a way compatible with recent weaviate client APIs
        client.schema.create_class(html_chunk_class)

def clear_index() -> None:
    client = _init_client()
    try:
        client.schema.delete_class("HtmlChunk")
    except Exception:
        # ignore if it doesn't exist or delete fails
        pass
    init_schema()

def embed_text(text: str) -> List[float]:
    vec = model.encode(text)
    return vec.tolist() if hasattr(vec, "tolist") else list(vec)

def embed_list(texts: List[str]) -> List[List[float]]:
    vecs = model.encode(texts)
    return vecs.tolist() if hasattr(vecs, "tolist") else [list(v) for v in vecs]

def insert_chunks(url: str, chunks: List[Dict[str, Any]]) -> None:
    client = _init_client()
    for chunk in chunks:
        vec = embed_text(chunk["text"])
        client.data_object.create(
            data_object={
                "url": url,
                "text": chunk["text"],
                "chunk_index": int(chunk["chunk_index"]),
                "start_token": int(chunk["start_token"]),
                "end_token": int(chunk["end_token"]),
            },
            class_name="HtmlChunk",
            vector=vec,
        )

def search_chunks(query: str, top_k: int = 10):
    client = _init_client()
    query_vec = embed_text(query)
    result = (
        client.query
        .get("HtmlChunk", ["chunk_index", "text", "start_token", "end_token"])
        .with_near_vector({"vector": query_vec})
        .with_limit(top_k)
        .with_additional(["certainty", "distance"])
        .do()
    )
    return result.get("data", {}).get("Get", {}).get("HtmlChunk", [])
