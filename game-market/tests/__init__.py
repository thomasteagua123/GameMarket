```eof

## 3. Archivos Necesarios en `tests/`

Simplemente **crea la carpeta `tests/`** al mismo nivel que tu carpeta `app/`. Dentro de ella, crea el archivo `__init__.py` y `conftest.py`.

### A. `tests/__init__.py`

```python:Inicializador de Paquete:tests/__init__.py

```eof

### B. `tests/conftest.py`

Este archivo es el que Pytest usa para configurar la aplicación y el cliente de pruebas.

```python:Configuración de Pytest Fixtures:tests/conftest.py
import pytest
from app.main import create_app
import os
from dotenv import load_dotenv

# Cargar variables de entorno para que el testing las use
load_dotenv() 

@pytest.fixture(scope='session')
def app():
    """Crea una instancia de la aplicación Flask para toda la sesión de pruebas."""
    # Le pasamos la configuración para indicar que es un entorno de testing
    app = create_app({
        'TESTING': True,
        'SECRET_KEY': os.getenv('SUPER_KEY', 'test-secret-key-123')
    })
    return app

@pytest.fixture
def client(app):
    """Crea el cliente de prueba de Flask, que simula peticiones HTTP."""
    return app.test_client()