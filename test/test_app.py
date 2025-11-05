import pytest
from flask import session
from unittest.mock import patch, MagicMock
from app import app   # Ajustá este import si tu archivo se llama distinto

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SECRET_KEY'] = 'testing-secret'
    with app.test_client() as client:
        yield client


# ======================
# 🌍 RUTA HOME
# ======================
def test_home(client):
    res = client.get('/')
    assert res.status_code == 200
    assert b"Bienvenido a GameMarket" in res.data


# ======================
# 🧑 PERFIL USUARIO (no logueado)
# ======================
def test_perfil_usuario_no_logueado(client):
    res = client.get('/perfil')
    assert res.status_code == 401
    assert b"No est" in res.data  # "No estás logueado"


# ======================
# 🧑 PERFIL USUARIO (logueado y encontrado)
# ======================
@patch('app.get_db_connection')
def test_perfil_usuario_logueado(mock_db, client):
    # Simular conexión y cursor
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = {'rol': 'usuario'}
    mock_conn = MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_db.return_value = mock_conn

    with client.session_transaction() as sess:
        sess['user'] = 'testuser'

    res = client.get('/perfil')
    assert res.status_code == 200
    assert b'testuser' in res.data


# ======================
# 🎮 RUTA GAMES
# ======================
@patch('app.get_db_connection')
def test_get_games(mock_db, client):
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [
        {'game_id': 1, 'name': 'Among Us', 'category': 'Party', 'price': 2000, 'information': 'Juego de deducción social'}
    ]
    mock_conn = MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_db.return_value = mock_conn

    res = client.get('/api/games')
    assert res.status_code == 200
    assert b'Among Us' in res.data


# ======================
# 🧾 REGISTRO USUARIO
# ======================
@patch('app.get_db_connection')
def test_register_user(mock_db, client):
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = None
    mock_conn = MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_db.return_value = mock_conn

    data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "12345"
    }
    res = client.post('/api/register', json=data)
    assert res.status_code in (201, 200)
    assert b"Usuario" in res.data or b"agregado" in res.data


# ======================
# 🔐 LOGIN INCORRECTO
# ======================
@patch('app.get_db_connection')
def test_login_incorrecto(mock_db, client):
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = None
    mock_conn = MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_db.return_value = mock_conn

    res = client.post('/login', json={"username": "fake", "password": "wrong"})
    assert res.status_code == 401
    assert b"incorrectos" in res.data or b"incorrecto" in res.data
