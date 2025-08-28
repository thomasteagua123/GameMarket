from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)



USERS = {
    "admin": "1234",
    "user1": "abcd"
}

def get_db_connection():
    conn = mysql.connector.connect(
        host="10.9.120.5",
        port=3306,
        user="gameMarket",     
        password="game1234",  
        database="gameMarket"    
    )
    return conn

@app.route("/")
def home():
    return "Bienvenido a GameMarket"


@app.route("/api/games", methods=["GET"])
def get_games():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT name, category, price FROM games")
    games = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(games)

@app.route("/api/clients", methods=["GET"])
def get_clients():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT first_name, last_name FROM client")
    clients = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(clients)

@app.route("/api/platform")
def platform():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT c.first_name, c.last_name, p.platform_name, g.name " \
    "FROM platform p " \
    "JOIN client c ON p.game_id = c.game_id JOIN games g ON g.game_id = c.game_id;   ")
    platform = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(platform)

@app.route("/api/buys")
def buys():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT c.first_name, c.last_name, g.name, g.price, payment_method " \
    "FROM buys b " \
    "JOIN client c ON c.client_id = b.client_id " \
    "JOIN games g ON g.game_id = b.game_id; ")
    buys = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(buys)

@app.route('/api/usuarios', methods=['GET'])
def add_user_get():
    username = request.args.get("username")
    password = request.args.get("password")

    if not username or not password:
        return jsonify({"error": "Faltan username o password"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO usuarios (username, password) VALUES (%s, %s)",
        (username, password)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": f"Usuario {username} agregado correctamente"})


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

