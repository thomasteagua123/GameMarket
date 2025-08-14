import sqlite3
from flask import Flask, g, jsonify, render_template, request



app = Flask(__name__)
DATABASE = 'database.db'  # Ruta a tu archivo SQLite


# --- Conexión a la base de datos ---
def get_db():
   if 'db' not in g:
       g.db = sqlite3.connect(DATABASE)
       g.db.row_factory = sqlite3.Row
   return g.db


@app.teardown_appcontext
def close_db(error):
   db = g.pop('db', None)
   if db is not None:
       db.close()


# --- Ruta de bienvenida ---
@app.route('/')
def home():
   return render_template('index.html')





@app.route('/games_html')
def games_html():
    db = get_db()
    cursor = db.execute('SELECT name, category, price FROM games')
    games = [dict(row) for row in cursor.fetchall()]
    return render_template('games.html', games=games)


# --- Ruta que devuelve todos los clientes ---
@app.route('/clients')
def get_clients():
   db = get_db()
   cursor = db.execute('SELECT first_name, last_name FROM client')
   clients = cursor.fetchall()
   return jsonify([dict(row) for row in clients])


@app.route('/platform_html')
def platform_html():
    db = get_db()
    cursor = db.execute('''
        SELECT platform.platform_name, games.name AS game_name
        FROM platform
        JOIN games ON platform.game_id = games.game_id
    ''')
    data = [dict(row) for row in cursor.fetchall()]
    return render_template('platform.html', platforms=data)

@app.route('/buscar', methods=['GET', 'POST'])
def buscar():
    resultados = []
    if request.method == 'POST':
        juego = request.form['juego']
        db = get_db()
        cursor = db.execute('''
            SELECT g.name AS game_name, g.category, g.price, 
                   p.platform_name, c.first_name, c.last_name
            FROM games g
            JOIN platform p ON g.game_id = p.game_id
            JOIN buys b ON g.game_id = b.game_id
            JOIN client c ON b.client_id = c.client_id
            WHERE g.name LIKE ?
        ''', ('%' + juego + '%',))
        resultados = [dict(row) for row in cursor.fetchall()]
    return render_template('buscar.html', resultados=resultados)



if __name__ == '__main__':
   app.run(debug=True)





