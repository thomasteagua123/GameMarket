from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/api/games")
def get_games():
    conn = get_db_connection()
    games = conn.execute("SELECT name, category, price FROM games").fetchall()
    conn.close()
    return jsonify([dict(row) for row in games])

@app.route("/api/clients")
def get_clients():
    conn = get_db_connection()
    clients = conn.execute("SELECT first_name, last_name FROM client").fetchall()
    conn.close()
    return jsonify([dict(row) for row in clients])

if __name__ == "__main__":
    app.run(debug=True)
