import json
from pathlib import Path

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from .embed import get_embedding

BASE_DIR = Path(__file__).resolve().parent
with open(BASE_DIR / "saved_profiles.json", "r", encoding="utf-8") as f:
    profiles = json.load(f)

def find_similar_businesses(text):
    query_embedding = np.array(get_embedding(text)).reshape(1, -1)

    results = []

    for profile in profiles:
        profile_embedding = np.array(profile["embedding"]).reshape(1, -1)

        score = cosine_similarity(query_embedding, profile_embedding)[0][0]

        results.append({
            "name": profile["name"],
            "category": profile["category"],
            "score": float(score)
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:3]