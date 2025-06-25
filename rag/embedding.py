import requests
import numpy as np

def get_embedding(text: str) -> np.ndarray:
    url = "https://ollama.sgcan.dev/api/embeddings"
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "nomic-embed-text",
        "prompt": text
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    return np.array(response.json()["embedding"], dtype="float32")
