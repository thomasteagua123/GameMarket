import pytest
from unittest.mock import patch, MagicMock
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


# ---------------- LOGIN ---------------- #
def test_login_success(client):
    with patch("app.get_db_connection") as mock_conn:
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = {
            "username": "testuser",
            "password": "hashed_password",
            "rol": "usuario"
        }
        mock_conn.return_value.cursor.return_value = mock_cursor

        # bcrypt.checkpw devuelve True → contraseña válida
        with patch("bcrypt.checkpw", return_value=True):
            res = client.post("/login", json={
                "username": "testuser",
                "password": "1234"
            })
            data = res.get_json()

            assert res.status_code == 200
            assert data["success"] is True
            assert "Login exitoso" in data["message"]


def test_login_invalid_credentials(client):
    with patch("app.get_db_connection") as mock_conn:
        mock_cursor = MagicMock()
        mock_cursor.fetchone.return_value = None  # Usuario no existe
        mock_conn.return_value.cursor.return_value = mock_cursor

        res = client.post("/login", json={
            "username": "fakeuser",
            "password": "wrong"
        })
        data = res.get_json()

        assert res.status_code == 401
        assert "incorrectos" in data["message"]


# ---------------- REGISTER ---------------- #
def test_register_duplicate_user(client):
    with patch("app.get_db_connection") as mock_conn:
        mock_cursor = MagicMock()
        # Simula que el usuario ya existe
        mock_cursor.fetchone.return_value = {"username": "testuser"}
        mock_conn.return_value.cursor.return_value = mock_cursor

        res = client.post("/api/register", json={
            "email": "test@example.com",
            "password": "1234",
            "username": "testuser"
        })
        data = res.get_json()

        assert res.status_code == 409
        assert "usuario con ese nombre" in data["error"]
