from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

USERS = {
    "admin": "1234",
    "user1": "abcd"
}

def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/api/games", methods=["GET", "POST", "PUT", "DELETE"])
def get_games():
    conn = get_db_connection()
    games = conn.execute("SELECT name, category, price FROM games").fetchall()
    conn.close()
    return jsonify([dict(row) for row in games])

@app.route("/api/clients", methods=["GET", "POST", "PUT", "DELETE"])
def get_clients():
    conn = get_db_connection()
    clients = conn.execute("SELECT first_name, last_name FROM client").fetchall()
    conn.close()
    return jsonify([dict(row) for row in clients])

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()  # <-- más seguro que request.json
    if not data:
        return jsonify({"success": False, "message": "No se recibieron datos"}), 400

    username = data.get("username")
    password = data.get("password")

    if username in USERS and USERS[username] == password:
        return jsonify({"success": True, "message": "Login exitoso"})
    else:
        return jsonify({"success": False, "message": "Usuario o contraseña incorrectos"}), 401

