from flask import Flask, jsonify, request, session
from flask_cors import CORS
import pymysql.cursors
import bcrypt
import os
from dotenv import load_dotenv

# ======================
# 🔧 Cargar variables .env
# ======================
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__)

# ======================
# ⚙️ Configuración de Flask
# ======================
app.config.from_mapping(
    SECRET_KEY=os.getenv('SUPER_KEY', 'change-me-default'),
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_SECURE=False,  # True si usás HTTPS
    SESSION_COOKIE_HTTPONLY=True,
)

# ======================
# 🌐 CORS Config (para React)
# ======================
frontend_urls = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS(
    app,
    origins=frontend_urls,
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Content-Type"]
)

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin in frontend_urls:
        response.headers["Access-Control-Allow-Origin"] = origin
    else:
        response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

# ======================
# 💾 Conexión a la base de datos
# ======================
def get_db_connection():
    conn = pymysql.connect(
        host=os.getenv('DB_HOST'),
        port=int(os.getenv('DB_PORT')),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME'),
        cursorclass=pymysql.cursors.DictCursor
    )
    return conn


@app.route("/")
def home():
    return "Bienvenido a GameMarket"


# ---------------- PERFIL ---------------- #
@app.route("/perfil", methods=["GET"])
def perfil_usuario():
    email = session.get("user")
    if email:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT rol FROM usuarios WHERE username=%s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            return jsonify({"email": email, "rol": user["rol"]})
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404
    else:
        return jsonify({"error": "No estas logueado"}), 401


# ---------------- GAMES ---------------- #
@app.route("/api/games", methods=["GET"])
def get_games():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT game_id, name, category, price, information FROM games")
    games = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(games)


@app.route("/api/clients", methods=["GET"])
def get_clients():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.client_id, c.first_name, c.last_name, g.name, g.price
        FROM client c
        JOIN games g ON c.game_id = g.game_id
    """)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)


@app.route("/api/clients", methods=["POST"])
def add_client():
    data = request.get_json()
    print("📦 Datos recibidos en /api/clients:", data)

    first_name = data.get("first_name")
    last_name = data.get("last_name")
    game_id = data.get("game_id")
    payment_method = data.get("payment_method")

    if not first_name or not last_name or not game_id or not payment_method:
        print("⚠️ Faltan datos:", first_name, last_name, game_id, payment_method)
        return jsonify({"error": "Faltan datos"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO client (first_name, last_name, game_id) VALUES (%s, %s, %s)",
            (first_name, last_name, game_id)
        )
        client_id = cursor.lastrowid

        cursor.execute(
            "INSERT INTO buys (client_id, game_id, payment_method) VALUES (%s, %s, %s)",
            (client_id, game_id, payment_method)
        )

        conn.commit()
        print(f"✅ Compra registrada: {first_name} {last_name} - {payment_method}")

        return jsonify({"message": "Compra registrada correctamente"}), 201

    except Exception as err:
        print("❌ Error al registrar compra:", err)
        return jsonify({"error": f"Error de DB: {err}"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# ---------------- REGISTRO ---------------- #
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")

    if not email or not username or not password:
        return jsonify({"error": "Faltan email, username o password"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM usuarios WHERE username=%s", (username,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({"error": "Ya existe un usuario con ese nombre"}), 409

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor.execute(
            "INSERT INTO usuarios (email, username, password, rol) VALUES (%s, %s, %s, %s)",
            (email, username, hashed_password, 'usuario')
        )
        conn.commit()
        return jsonify({"message": f"Usuario {username} agregado correctamente"}), 201
    except Exception as err:
        return jsonify({"error": f"Error de DB: {err}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# ---------------- LOGIN ---------------- #
@app.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "No se recibieron datos"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "message": "Faltan datos"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE username=%s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        session['user'] = username
        return jsonify({"success": True, "message": "Login exitoso", "rol": user['rol']})
    else:
        return jsonify({"success": False, "message": "Usuario o contraseña incorrectos"}), 401


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop('user', None)
    return jsonify({"success": True, "message": "Logout exitoso"})


# ---------------- ADMIN ENDPOINT ---------------- #
@app.route("/admin", methods=["GET"])
def admin_only():
    email = session.get("user")
    if not email:
        return jsonify({"error": "No autenticado"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT rol FROM usuarios WHERE username = %s", (email,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()

    if not result:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if result['rol'] != 'admin':
        return jsonify({"error": "Acceso denegado"}), 403

    return jsonify({"message": f"Bienvenido admin {email}"}), 200


# ---------------- STOCK ---------------- #
@app.route("/api/products/<int:game_id>/decrement", methods=["POST"])
def decrement_stock(game_id):
    data = request.get_json()
    amount = data.get("amount", 1)

    if amount <= 0:
        return jsonify({"error": "Cantidad inválida"}), 400

    conn = None
    cursor = None  # 🔧 inicialización segura

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT stock_quantity FROM inventory WHERE game_id = %s", (str(game_id),))
        game = cursor.fetchone()
        if not game:
            return jsonify({"error": "Juego no encontrado"}), 404

        stock_actual = game["stock"]
        if stock_actual < amount:
            return jsonify({"error": "No hay suficiente stock"}), 400

        nuevo_stock = stock_actual - amount
        cursor.execute(
            "UPDATE inventory SET stock_quantity = %s WHERE game_id = %s",
            (nuevo_stock, game_id)
        )
        conn.commit()

        return jsonify({"message": "Stock actualizado", "stock": nuevo_stock}), 200

    except Exception as err:
        return jsonify({"error": f"Error al actualizar stock: {err}"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)