from pydantic import BaseModel

class SearchRequest(BaseModel):
    url: str
    query: str

class ChunkResult(BaseModel):
    chunk_index: int
    score: float
    text: str
    start_token: int
    end_token: int

class SearchResponse(BaseModel):
    url: str
    query: str
    results: list[ChunkResult]