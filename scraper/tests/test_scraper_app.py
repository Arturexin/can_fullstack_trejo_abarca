import pytest
from unittest.mock import patch, MagicMock
from app import app as scraper_app

@pytest.fixture
def client():
    scraper_app.config['TESTING'] = True
    with scraper_app.test_client() as client:
        yield client

def test_process_links(client):
    mock_links = [(1, "https://www.comunidadandina.org/notas-de-prensa/acta-de-la-reunion-can-argentina-para-dar-inicio-a-las-negociaciones-de-un-acuerdo-de-preferencias-arancelarias"), 
                  (2, "https://www.comunidadandina.org/notas-de-prensa/can-organiza-tercer-programa-de-formacion-para-funcionarios-publicos-de-paises-miembros")]

    with patch("app.get_connection") as mock_get_conn, \
         patch("app.scrape_link.delay") as mock_scrape_delay:

        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = mock_links

        mock_conn = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_get_conn.return_value = mock_conn

        response = client.post("/process", json={"file_id": 123})
        assert response.status_code == 200

        data = response.get_json()
        assert data["message"] == f"{len(mock_links)} links enviados para scrapeo"

        # Verifica que scrape_link.delay fue llamado correctamente
        assert mock_scrape_delay.call_count == len(mock_links)

        for (link_id, url), call in zip(mock_links, mock_scrape_delay.call_args_list):
            args, kwargs = call
            assert args[0] == link_id
            assert args[1] == url

        # Verifica que el estado del archivo fue actualizado
        mock_cursor.execute.assert_any_call(
            "UPDATE files SET status = 'processing' WHERE id = %s", (123,)
        )
