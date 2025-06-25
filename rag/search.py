
from embedding import get_embedding
from indexer import load_user_embeddings
import numpy as np

def search_similar(query: str, user_id: int):
    index, metadata = load_user_embeddings(user_id)
    if index is None or metadata is None:
        return []

    embedding = np.array(get_embedding(query), dtype='float32')
    D, I = index.search(np.array([embedding]), k=5)

    results = []
    for idx in I[0]:
        link_id, title, body = metadata[idx]
        results.append({
            "link_id": link_id,
            "title": title or "(Sin título)",
            "excerpt": (body or '')[:200]
        })
    return results
