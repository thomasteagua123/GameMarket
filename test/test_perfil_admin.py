import pytest
from unittest.mock import patch, MagicMock

@pytest.fixture
def client():
    from app import app
    app.config["TESTING"] = True
    app.config["SECRET_KEY"] = "testing-key"
    with app.test_client() as client:
        yield client


#Test: acceso a /perfil con usuario logueado
@patch("app.get_db_connection")
def test_perfil_acceso_usuario(mock_db, client):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = {"rol": "usuario"}
    mock_conn.cursor.return_value = mock_cursor
    mock_db.return_value = mock_conn

    # Simulamos sesión con usuario logueado
    with client.session_transaction() as sess:
        sess["user"] = "dylan"

    res = client.get("/perfil")
    data = res.get_json()

    assert res.status_code == 200, f"Estado devuelto: {res.status_code}"
    assert data["email"] == "dylan"
    assert data["rol"] == "usuario"


#Test: intento de acceder sin sesión
def test_perfil_sin_sesion(client):
    res = client.get("/perfil")
    data = res.get_json()

    assert res.status_code == 401
    assert "error" in data


# Test: acceso a /admin con usuario administrador
@patch("app.get_db_connection")
def test_admin_acceso(mock_db, client):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = {"rol": "admin"}
    mock_conn.cursor.return_value = mock_cursor
    mock_db.return_value = mock_conn

    # Simulamos sesión con usuario admin
    with client.session_transaction() as sess:
        sess["user"] = "admin"

    res = client.get("/admin")
    data = res.get_json()

    assert res.status_code == 200, f"Estado devuelto: {res.status_code}"
    assert "Bienvenido" in data["message"]
