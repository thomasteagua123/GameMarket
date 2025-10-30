# Importamos pytest para los tests
import pytest
# Importamos la aplicación Flask
from app import app
# Importamos random para generar datos únicos en tests (ej. usernames)
import random
import string

# ---------------------- CONFIGURACIÓN DE LOS TESTS ---------------------- #

# Fixture para crear un cliente de prueba (igual que antes)
@pytest.fixture
def cliente_prueba():
    # Activamos el modo de testing en Flask
    app.config['TESTING'] = True
    # Desactivamos CSRF para simplificar
    app.config['WTF_CSRF_ENABLED'] = False
    # Creamos el cliente de prueba
    with app.test_client() as cliente:
        yield cliente

# Función helper para simular login (útil para rutas que requieren sesión)
def login_usuario(cliente, username="testuser", password="testpass"):
    """Simula un login exitoso y devuelve la respuesta"""
    # Primero, registra un usuario de prueba si no existe (para evitar errores)
    cliente.post('/api/register', json={
        "email": f"{username}@example.com",
        "username": username,
        "password": password
    })
    # Luego, hace login
    return cliente.post('/login', json={
        "username": username,
        "password": password
    })

# ---------------------- TESTS PARA CADA RUTA ---------------------- #

def test_perfil_usuario_sin_sesion(cliente_prueba):
    """Prueba /perfil sin estar logueado (debe devolver 401)"""
    respuesta = cliente_prueba.get('/perfil')
    assert respuesta.status_code == 401
    assert b"No est" in respuesta.data  # Parte de "No estás logueado"

def test_perfil_usuario_con_sesion(cliente_prueba):
    """Prueba /perfil con sesión activa (debe devolver datos del usuario)"""
    # Primero, simulamos login
    login_respuesta = login_usuario(cliente_prueba)
    assert login_respuesta.status_code == 200  # Login exitoso
    
    # Ahora, accedemos a /perfil
    respuesta = cliente_prueba.get('/perfil')
    assert respuesta.status_code == 200
    # Verificamos que devuelva email y rol (asumiendo que el usuario existe en DB)
    data = respuesta.get_json()
    assert "email" in data
    assert "rol" in data
    # assert data["email"] == "juan@hotmail.com"

def test_obtener_juegos(cliente_prueba):
    """Prueba /api/games (debe devolver lista de juegos)"""
    respuesta = cliente_prueba.get('/api/games')
    # Puede ser 200 (éxito) o 500 (si no hay DB)
    # assert respuesta.status_code in (200, 500)
    assert respuesta.status_code == 200:
    data = respuesta.get_json()
    assert isinstance(data, list)  # Debe ser una lista
    titulos = [d["title"] for d in data]
    assert "Final Fantasy" in titulos

def test_obtener_clientes(cliente_prueba):
    """Prueba /api/clients GET (debe devolver lista de clientes)"""
    respuesta = cliente_prueba.get('/api/clients')
    assert respuesta.status_code in (200, 500)
    if respuesta.status_code == 200:
        data = respuesta.get_json()
        assert isinstance(data, list)

def test_agregar_cliente(cliente_prueba):
    """Prueba /api/clients POST (agregar un nuevo cliente)"""
    # Datos de prueba (asumiendo que game_id=1 existe en DB)
    datos_prueba = {
        "first_name": "Juan",
        "last_name": "Pérez",
        "game_id": 1,
        "payment_method": "tarjeta"
    }
    respuesta = cliente_prueba.post('/api/clients', json=datos_prueba)
    # Puede ser 201 (creado) o 500 (error DB)
    assert respuesta.status_code in (201, 500)
    if respuesta.status_code == 201:
        data = respuesta.get_json()
        assert "message" in data  # Mensaje de éxito

def test_registro_usuario_exitoso(cliente_prueba):
    """Prueba /api/register con datos completos"""
    # Generamos un username único para evitar conflictos
    username_unico = "usuario" + ''.join(random.choices(string.ascii_lowercase, k=5))
    datos_prueba = {
        "email": f"{username_unico}@example.com",
        "username": username_unico,
        "password": "password123"
    }
    respuesta = cliente_prueba.post('/api/register', json=datos_prueba)
    assert respuesta.status_code in (201, 500)  # 201 si se registra, 500 si DB falla
    if respuesta.status_code == 201:
        data = respuesta.get_json()
        assert "message" in data

def test_registro_usuario_datos_faltantes(cliente_prueba):
    """Prueba /api/register con datos incompletos (debe devolver 400)"""
    respuesta = cliente_prueba.post('/api/register', json={
        "email": "test@example.com"
        # Faltan username y password
    })
    assert respuesta.status_code == 400
    assert b"Faltan" in respuesta.data

def test_login_exitoso(cliente_prueba):
    """Prueba /login con credenciales correctas"""
    # Primero, registra un usuario
    username = "loginuser" + ''.join(random.choices(string.ascii_lowercase, k=5))
    login_usuario(cliente_prueba, username=username, password="testpass")
    
    # Ahora, intenta login
    respuesta = cliente_prueba.post('/login', json={
        "username": username,
        "password": "testpass"
    })
    assert respuesta.status_code == 200
    data = respuesta.get_json()
    assert data["success"] == True
    assert "rol" in data

def test_login_fallido(cliente_prueba):
    """Prueba /login con usuario inexistente o contraseña incorrecta"""
    respuesta = cliente_prueba.post('/login', json={
        "username": "noexiste",
        "password": "wrongpass"
    })
    assert respuesta.status_code == 401
    data = respuesta.get_json()
    assert data["success"] == False

def test_logout(cliente_prueba):
    """Prueba /logout (debe cerrar sesión)"""
    # Primero, login
    login_usuario(cliente_prueba)
    # Luego, logout
    respuesta = cliente_prueba.post('/logout')
    assert respuesta.status_code == 200
    data = respuesta.get_json()
    assert data["success"] == True

def test_admin_sin_autenticacion(cliente_prueba):
    """Prueba /admin sin login (debe devolver 401)"""
    respuesta = cliente_prueba.get('/admin')
    assert respuesta.status_code == 401

def test_admin_con_usuario_normal(cliente_prueba):
    """Prueba /admin con usuario no admin (debe devolver 403)"""
    # Login con usuario normal
    login_usuario(cliente_prueba)
    respuesta = cliente_prueba.get('/admin')
    assert respuesta.status_code == 403

# Nota: Para probar /admin con un admin real, necesitarías un usuario con rol 'admin' en DB.
# Puedes agregar un test similar registrando un admin manualmente si es necesario.
