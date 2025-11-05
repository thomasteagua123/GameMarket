from unittest.mock import patch, MagicMock

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
    assert res.status_code == 201
    assert b"Usuario" in res.data or b"agregado" in res.data
