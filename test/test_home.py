def test_home(client):
    res = client.get('/')
    assert res.status_code == 200
    assert b"Bienvenido a GameMarket" in res.data
