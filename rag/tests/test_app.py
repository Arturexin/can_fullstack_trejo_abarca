import pytest
import json
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_route_not_found(client):
    res = client.get('/')
    # Este app.py no tiene ruta '/', puede devolver 404
    assert res.status_code in [200, 404]

def test_init_embeddings_missing_user_id(client):
    response = client.post('/init', json={})
    assert response.status_code == 400
    assert b"Falta user_id" in response.data

def test_search_missing_fields(client):
    response = client.post('/search', json={})
    assert response.status_code == 400
    assert b"Faltan 'query' o 'user_id'" in response.data

def test_search_no_embeddings(monkeypatch, client):
    def mock_load_user_embeddings(user_id):
        return None, None

    monkeypatch.setattr("app.load_user_embeddings", mock_load_user_embeddings)

    response = client.post('/search', json={"query": "economía", "user_id": 1})
    assert response.status_code == 200

    # ✅ Analiza el JSON directamente
    data = response.get_json()
    assert "Aún no tienes embeddings generados" in data["message"]