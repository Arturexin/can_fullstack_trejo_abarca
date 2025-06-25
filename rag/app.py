from flask import Flask, request, jsonify
from indexer import generate_embeddings_for_user, load_user_embeddings
from embedding import get_embedding
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/init', methods=['POST'])
def init_embeddings():
    data = request.get_json(force=True)
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "Falta user_id"}), 400
    count = generate_embeddings_for_user(user_id)
    return jsonify({"message": f"Embeddings generados: {count}"})

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json(force=True)
    query   = data.get("query")
    user_id = data.get("user_id")

    if not query or not user_id:
        return jsonify({"error": "Faltan 'query' o 'user_id'"}), 400

    # Carga el índice y metadata para el usuario
    index, metadata = load_user_embeddings(user_id)

    # 1️⃣ Si no hay embeddings cargados para este usuario:
    if index is None or metadata is None:
        return jsonify({"message": "Aún no tienes embeddings generados. Ejecuta Generar Embeddings."}), 200

    # 2️⃣ Si hay embeddings, pero la búsqueda no arroja nada:
    embedding = np.array(get_embedding(query), dtype='float32')
    D, I = index.search(np.array([embedding]), k=5)
    results = []
    for idx in I[0]:
        if 0 <= idx < len(metadata):
            link_id, title, body = metadata[idx]
            results.append({
                "link_id": link_id,
                "title": title or "(Sin título)",
                "excerpt": (body or '')
            })

    if not results:
        return jsonify({"message": "No se encontraron resultados para tu consulta."}), 200

    # 3️⃣ Caso normal: devolvemos los resultados
    return jsonify(results), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9030)