import pytest
from app import app
from unittest.mock import patch, MagicMock

@pytest.fixture
def client():
    """Configura el cliente de pruebas de Flask."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_decrement_stock_success(client):
    """Verifica el decremento exitoso del stock y la respuesta 200."""
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = {"stock": 5}
    
    with patch("app.get_db_connection") as mock_conn:
        mock_conn.return_value.cursor.return_value = mock_cursor

        res = client.post("/api/products/1/decrement", json={"amount": 1})
        assert res.status_code == 200
        data = res.get_json()
        
        assert data["stock"] == 4
        assert "Stock actualizado" in data["message"]

def test_decrement_stock_not_enough(client):
    """Verifica que devuelve 400 cuando la cantidad solicitada excede el stock."""
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = {"stock": 2}
    
    with patch("app.get_db_connection") as mock_conn:
        mock_conn.return_value.cursor.return_value = mock_cursor

        res = client.post("/api/products/1/decrement", json={"amount": 5})
        assert res.status_code == 400
        data = res.get_json()
        assert "No hay suficiente stock" in data["error"]

def test_decrement_stock_not_found(client):
    # """Verifica que devuelve 404 cuando el juego no existe en la DB."""
    # mock_cursor = MagicMock()
    # mock_cursor.fetchone.return_value = None
    
    # with patch("app.get_db_connection") as mock_conn:
    #     mock_conn.return_value.cursor.return_value = mock_cursor

    res = client.post("/api/products/99/decrement", json={"amount": 1}) 
    
    assert res.status_code == 404
    
    data = res.get_json()
    assert data is not None
    assert "Juego no encontrado" in data["error"]
