
import faiss
import numpy as np
import ast
from database import get_connection
from embedding import get_embedding

DIM = 768

def generate_embeddings_for_user(user_id: int):
    """Inserta en la tabla embeddings los vectores faltantes para el user_id."""
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT l.id, s.title, s.body
        FROM links l
        JOIN files f ON l.file_id = f.id
        JOIN scraped_content s ON s.link_id = l.id
        WHERE f.user_id = %s
          AND l.id NOT IN (SELECT link_id FROM embeddings)
    """, (user_id,))
    rows = cur.fetchall()

    inserted = 0
    for link_id, title, body in rows:
        text = f"{title or ''} {body or ''}"
        embedding = np.array(get_embedding(text), dtype=np.float32)
        cur.execute("""
            INSERT INTO embeddings (link_id, vector, model)
            VALUES (%s, %s, %s)
        """, (link_id, embedding.tolist(), 'openai'))
        inserted += 1

    conn.commit()
    cur.close()
    conn.close()
    return inserted

def load_user_embeddings(user_id: int):
    """Carga de la BD los vectores del usuario y construye un índice FAISS."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT e.vector, l.id, s.title, s.body
        FROM embeddings e
        JOIN links l ON e.link_id = l.id
        JOIN files f ON l.file_id = f.id
        JOIN scraped_content s ON s.link_id = l.id
        WHERE f.user_id = %s
    """, (user_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if not rows:
        return None, None

    index = faiss.IndexFlatL2(DIM)
    metadata = []
    for vector, link_id, title, body in rows:
        # Si 'vector' es un string, lo parseamos
        if isinstance(vector, str):
            vec_list = ast.literal_eval(vector)
        else:
            vec_list = vector  # ya es iterable

        vec_np = np.array(vec_list, dtype='float32')
        index.add(np.array([vec_np]))
        metadata.append((link_id, title, body))

    return index, metadata
