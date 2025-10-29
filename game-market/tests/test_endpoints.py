import pytest
from unittest.mock import MagicMock

# Nota: El 'client' y 'app' son provistos por conftest.py

# ----------------------------------------------------
# CONFIGURACIÓN DE MOCKS
# ----------------------------------------------------

# Datos simulados de la base de datos
MOCK_USER = {'username': 'test_user', 'password': b'hashed_password', 'rol': 'usuario'}
MOCK_ADMIN = {'username': 'admin_user', 'password': b'hashed_admin_password', 'rol': 'admin'}
MOCK_GAMES_DATA = [
    {'game_id': 1, 'name': 'Game A', 'category': 'Cat 1', 'price': 100},
    {'game_id': 2, 'name': 'Game B', 'category': 'Cat 2', 'price': 200},
]
MOCK_CLIENTS_DATA = [
    {'client_id': 1, 'first_name': 'A', 'last_name': 'Z', 'name': 'Game A', 'price': 100}
]

@pytest.fixture(autouse=True)
def mock_db_connection(mocker):
    """
    Fixture que simula (mockea) la conexión a la base de datos (get_db_connection) 
    y todas las interacciones con el cursor para evitar la conexión real a MySQL.
    """
    mock_cursor = MagicMock()
    mock_conn = MagicMock()
    
    # Simular la conexión (conn.cursor() -> mock_cursor)
    mock_conn.cursor.return_value = mock_cursor
    
    # Mockear la función get_db_connection global
    mocker.patch('app.main.get_db_connection', return_value=mock_conn)

    # Devolvemos el mock_cursor para que las pruebas específicas puedan configurarlo
    return mock_cursor

# ----------------------------------------------------
# PRUEBAS GENERALES Y HOME
# ----------------------------------------------------

def test_home_endpoint(client):
    """Verifica que el endpoint principal (/) devuelva el mensaje de bienvenida."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.data.decode('utf-8') == "Bienvenido a GameMarket"

# ----------------------------------------------------
# PRUEBAS DE GAMES Y CLIENTS (GET)
# ----------------------------------------------------

def test_get_games_success(client, mock_db_connection):
    """Verifica que /api/games devuelva la lista de juegos."""
    mock_db_connection.fetchall.return_value = MOCK_GAMES_DATA
    response = client.get("/api/games")
    assert response.status_code == 200
    assert response.get_json() == MOCK_GAMES_DATA

def test_get_clients_success(client, mock_db_connection):
    """Verifica que /api/clients GET devuelva la lista de clientes."""
    mock_db_connection.fetchall.return_value = MOCK_CLIENTS_DATA
    response = client.get("/api/clients")
    assert response.status_code == 200
    assert response.get_json() == MOCK_CLIENTS_DATA

# ----------------------------------------------------
# PRUEBAS DE CLIENTS (POST)
# ----------------------------------------------------

def test_add_client_success(client, mock_db_connection):
    """Verifica que /api/clients POST funcione con datos válidos."""
    data = {
        "first_name": "Test", 
        "last_name": "User", 
        "game_id": 1, 
        "payment_method": "CreditCard"
    }
    # Simular el ID de la fila insertada
    mock_db_connection.lastrowid = 10 
    response = client.post("/api/clients", json=data)
    assert response.status_code == 201
    assert "Compra registrada correctamente" in response.get_json()["message"]
    
    # Verificar que se intentaron hacer las inserciones en la DB
    assert mock_db_connection.execute.call_count == 2
    
def test_add_client_missing_data(client):
    """Verifica que /api/clients POST falle con estado 400 si faltan datos."""
    response = client.post("/api/clients", json={
        "first_name": "Test", 
        "last_name": "User", 
        "game_id": 1
        # Falta payment_method
    })
    assert response.status_code == 400
    assert "Faltan datos" in response.get_json()["error"]

# ----------------------------------------------------
# PRUEBAS DE LOGIN / LOGOUT / PERFIL
# ----------------------------------------------------

def test_login_success(client, mock_db_connection, mocker):
    """Verifica el login exitoso (mockeando el usuario y la contraseña)."""
    
    # Simular la verificación de la contraseña
    mocker.patch('bcrypt.checkpw', return_value=True)
    # Simular la obtención del usuario de la DB
    mock_db_connection.fetchone.return_value = MOCK_USER
    
    response = client.post("/login", json={
        "username": MOCK_USER['username'], 
        "password": "test_pass"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] == True
    assert data["rol"] == "usuario"
    
def test_logout_success(client):
    """Verifica que /logout elimine la sesión."""
    # Nota: No necesitamos simular el login ya que session.pop funciona sin DB
    response = client.post("/logout")
    assert response.status_code == 200
    assert response.get_json()["success"] == True
    
# ----------------------------------------------------
# PRUEBAS DE ACCESO DE ADMINISTRADOR (/admin)
# ----------------------------------------------------

def test_admin_access_allowed(app, mock_db_connection):
    """Verifica que un usuario con rol 'admin' pueda acceder a /admin."""
    # 1. Configurar DB mock para que devuelva rol 'admin'
    mock_db_connection.fetchone.return_value = {'rol': 'admin'}

    with app.test_client() as client:
        # Simular inicio de sesión (simplemente establecemos la sesión)
        with client.session_transaction() as sess:
            sess['user'] = 'admin_user'
            
        # Acceder al endpoint /admin
        admin_response = client.get("/admin")
        assert admin_response.status_code == 200
        assert "Bienvenido admin admin_user" in admin_response.get_json()["message"]

def test_admin_access_denied_as_regular_user(app, mock_db_connection):
    """Verifica que un usuario regular (no admin) reciba 403."""
    # 1. Configurar DB mock para que devuelva rol 'usuario'
    mock_db_connection.fetchone.return_value = {'rol': 'usuario'}
    
    with app.test_client() as client:
        # Simular sesión de usuario regular
        with client.session_transaction() as sess:
            sess['user'] = 'test_user'
            
        # Intentar acceder a /admin
        admin_response = client.get("/admin")
        assert admin_response.status_code == 403
        assert "Acceso denegado" in admin_response.get_json()["error"]
