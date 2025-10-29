import pytest
from gamemarket.app import create_app  # Import absoluto correcto
import json

@pytest.fixture
def app():
    # Configuración de prueba
    app = create_app({
        "TESTING": True,
        "SECRET_KEY": "test-key"
    })
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

# ---------------- TESTS ---------------- #

def test_home(client):
    res = client.get("/")
    assert res.status_code == 200
    assert b"Bienvenido a GameMarket" in res.data

def test_perfil_no_logueado(client):
    res = client.get("/perfil")
    assert res.status_code == 401
    data = res.get_json()
    assert data["error"] == "No estás logueado"

def test_login_incorrecto(client):
    res = client.post("/login", json={"username": "fake", "password": "123"})
    assert res.status_code == 401
    data = res.get_json()
    assert not data["success"]

def test_logout(client):
    res = client.post("/logout")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"]

def test_admin_no_auth(client):
    res = client.get("/admin")
    assert res.status_code == 401
    data = res.get_json()
    assert data["error"] == "No autenticado"
