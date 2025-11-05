import pytest
from app import app   # ajustá si tu archivo Flask principal está en otro lugar

@pytest.fixture(scope="module")
def client():
    """
    Crea un cliente de prueba de Flask para usar en los tests.
    """
    app.config["TESTING"] = True
    app.config["SECRET_KEY"] = "testing-secret"
    app.config["WTF_CSRF_ENABLED"] = False  # por si usás formularios
    app.config["SESSION_COOKIE_SECURE"] = False

    with app.test_client() as client:
        yield client
