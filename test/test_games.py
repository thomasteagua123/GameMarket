from unittest.mock import patch, MagicMock

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
