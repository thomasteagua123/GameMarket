import pytest
from unittest.mock import patch, MagicMock
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


# ---------------- GET /api/games ---------------- #
def test_get_all_products(client):
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [
        {"game_id": 1, "name": "GTA V", "price": 5000, "category": "Acción"},
        {"game_id": 2, "name": "Minecraft", "price": 3000, "category": "Aventura"},
    ]

    with patch("app.get_db_connection") as mock_conn:
        mock_conn.return_value.cursor.return_value = mock_cursor

        res = client.get("/api/games")
        data = res.get_json()

        assert res.status_code == 200
        assert isinstance(data, list)
        assert len(data) == 2
        assert data[0]["name"] == "GTA V"


# ---------------- POST /api/clients ---------------- #
def test_add_new_product_success(client):
    new_client = {
        "first_name": "Juan",
        "last_name": "Pérez",
        "game_id": 1,
        "payment_method": "Tarjeta"
    }

    with patch("app.get_db_connection") as mock_conn:
        mock_cursor = MagicMock()
        mock_conn.return_value.cursor.return_value = mock_cursor

        res = client.post("/api/clients", json=new_client)
        data = res.get_json()

        # Como la ruta devuelve 201 cuando todo sale bien
        assert res.status_code == 201
        assert "Compra registrada" in data["message"]


def test_add_new_product_missing_data(client):
    new_client = {
        "first_name": "Juan",
        "game_id": 1
    }

    res = client.post("/api/clients", json=new_client)
    data = res.get_json()

    assert res.status_code == 400
    assert "Faltan datos" in data["error"]
