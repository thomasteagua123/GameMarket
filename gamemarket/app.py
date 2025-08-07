import sqlite3
from flask import Flask, g, jsonify, render_template

app = Flask(__name__)
DATABASE = 'database.db'  # Ruta a tu archivo SQLite

# --- Conexión a la base de datos ---
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row  # Devuelve resultados como diccionarios
    return g.db

@app.teardown_appcontext
def close_db(error):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# --- Ejemplo de ruta que devuelve datos de la tabla GAMES ---
@app.route('/games')
def get_games():
    db = get_db()
    cursor = db.execute('SELECT name, category, price FROM games')
    games = cursor.fetchall()
    return jsonify([dict(row) for row in games])

# --- Ejemplo de ruta para ver todos los clientes ---
@app.route('/clients')
def get_clients():
    db = get_db()
    cursor = db.execute('SELECT first_name, last_name FROM client')
    clients = cursor.fetchall()
    return jsonify([dict(row) for row in clients])

if __name__ == '__main__':
    app.run(debug=True)
