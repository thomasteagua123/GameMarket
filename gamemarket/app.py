from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Conexión a la DB
def get_db_connection():
    conn = mysql.connector.connect(
        host="10.9.120.5",
        port=3306,
        user="gameMarket",
        password="game1234",
        database="gameMarket"
    )
    return conn

# ---------------- RUTAS ---------------- #

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

@app.route("/api/platform", methods=["GET"])
def get_platform():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT c.first_name, c.last_name, p.platform_name, g.name "
        "FROM platform p "
        "JOIN client c ON p.game_id = c.game_id "
        "JOIN games g ON g.game_id = c.game_id"
    )
    platform = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(platform)

@app.route("/api/buys", methods=["GET"])
def get_buys():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT c.first_name, c.last_name, g.name, g.price, payment_method "
        "FROM buys b "
        "JOIN client c ON c.client_id = b.client_id "
        "JOIN games g ON g.game_id = b.game_id"
    )
    buys = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(buys)

# ---------------- REGISTRO ---------------- #
@app.route('/api/usuarios', methods=['GET'])
def add_user_to_db():  # ✅ Nombre único
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

# ---------------- LOGIN ---------------- #
@app.route("/login", methods=["POST"])
def login_user():  # ✅ Nombre único
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "No se recibieron datos"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "message": "Faltan datos"}), 400

    # Buscar usuario en la DB
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM usuarios WHERE username=%s AND password=%s",
        (username, password)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify({"success": True, "message": "Login exitoso"})
    else:
        return jsonify({"success": False, "message": "Usuario o contraseña incorrectos"}), 401

# ---------------- RUN ---------------- #
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
