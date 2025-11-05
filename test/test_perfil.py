from unittest.mock import patch, MagicMock

def test_perfil_usuario_no_logueado(client):
    res = client.get('/perfil')
    assert res.status_code == 401
    assert b"No estas logueado" in res.data
    print(res.data)

@patch('app.get_db_connection')
def test_perfil_usuario_logueado(mock_db, client):
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
