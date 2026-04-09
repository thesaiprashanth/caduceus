from fastapi import FastAPI
from pydantic import BaseModel
from similarity.predict import find_similar_businesses

app = FastAPI()

class Query(BaseModel):
    text: str

@app.post("/similarity")
def similarity(query: Query):
    return {
        "similarBusinesses": find_similar_businesses(query.text)
    }