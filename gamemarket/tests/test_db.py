import pytest
import pymysql

# ------------------- Configuración ------------------- #
DB_CONFIG = {
    "host": "10.9.120.5",
    "user": "gameMarket",
    "password": "game1234",
    "database": "gameMarket"
}

@pytest.fixture
def db_conn():
    """Crea y cierra la conexión a la base de datos para los tests"""
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    yield conn
    conn.close()

# ------------------- Tests ------------------- #

def test_usuarios_no_vacio(db_conn):
    """Verifica que la tabla usuarios tenga al menos un registro"""
    cursor = db_conn.cursor()
    cursor.execute("SELECT id, username, email FROM usuarios LIMIT 5;")
    usuarios = cursor.fetchall()
    cursor.close()

    assert len(usuarios) > 0, "❌ La tabla usuarios está vacía"

    print("\n✅ Usuarios encontrados:")
    for u in usuarios:
        print(f"ID: {u['id']}, Username: {u['username']}, Email: {u['email']}")

def test_usuarios_campos(db_conn):
    """Verifica que la tabla usuarios tenga las columnas esperadas"""
    cursor = db_conn.cursor()
    cursor.execute("DESCRIBE usuarios;")
    columnas = [fila["Field"] for fila in cursor.fetchall()]
    cursor.close()

    columnas_esperadas = ["id", "username", "email", "password"]
    for col in columnas_esperadas:
        assert col in columnas, f"❌ Falta la columna {col} en usuarios"
