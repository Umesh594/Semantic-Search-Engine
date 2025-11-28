from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import SearchRequest, SearchResponse, ChunkResult
from utils import fetch_and_clean_html
from chunking import chunk_text
from vector import init_schema, clear_index, insert_chunks, search_chunks

app = FastAPI(title="Content Search API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup() -> None:
    try:
        init_schema()
    except Exception as e:
        print("Weaviate initialization failed on startup:", e)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/search", response_model=SearchResponse)
def search(req: SearchRequest) -> SearchResponse:
   
    try:
        text = fetch_and_clean_html(req.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch or parse URL: {e}")

   
    chunks = chunk_text(text)

    
    try:
        clear_index()
        insert_chunks(req.url, chunks)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Vector database error during indexing: {e}")

    
    try:
        results = search_chunks(req.query, top_k=10)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Vector database error during search: {e}")


    final_results: list[ChunkResult] = []
    for obj in results:
        props = obj
        score = 0.0
        additional = obj.get("_additional") if isinstance(obj, dict) else None
        if additional:
            if isinstance(additional.get("certainty"), (int, float)):
                score = float(additional["certainty"])
            elif isinstance(additional.get("distance"), (int, float)):
                
                score = max(0.0, 1.0 - float(additional["distance"]))
        final_results.append(
            ChunkResult(
                chunk_index=int(props.get("chunk_index", 0)),
                text=str(props.get("text", "")),
                score=score,
                start_token=int(props.get("start_token", 0)),
                end_token=int(props.get("end_token", 0)),
            )
        )

    return SearchResponse(url=req.url, query=req.query, results=final_results)