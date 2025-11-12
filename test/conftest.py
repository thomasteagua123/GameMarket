import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SECRET_KEY'] = 'testing-secret'
    with app.test_client() as client:
        yield client
@pytest.fixture
def my_fixture():
    # Setup code: This runs before any test that uses this fixture
    print("Setting up resource...")
    resource = "some_resource"
    yield resource  # The value yielded is passed to the test function
    # Teardown code: This runs after the test function finishes
    print("Tearing down resource...")
