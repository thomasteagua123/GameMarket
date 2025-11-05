from unittest.mock import patch, MagicMock

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
