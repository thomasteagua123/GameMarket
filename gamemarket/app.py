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
    SESSION_COOKIE_SAMESITE='None',   # Necesario para CORS + cookies
    SESSION_COOKIE_SECURE=False,       # True si usás HTTPS
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

# 🩹 Parche adicional (asegura CORS en todas las respuestas)
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
        host=os.getenv('DB_HOST', '127.0.0.1'),
        port=int(os.getenv('DB_PORT', 3306)),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', ''),
        cursorclass=pymysql.cursors.DictCursor
    )
    return conn

# ======================
# 🏠 RUTA PRINCIPAL
# ======================
@app.route("/")
def home():
    return "Bienvenido a GameMarket"

# ======================
# 👤 PERFIL
# ======================
@app.route("/perfil", methods=["GET"])
def perfil_usuario():
    email = session.get("user")
    if not email:
        return jsonify({"error": "No estás logueado"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT rol FROM usuarios WHERE username=%s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify({"email": email, "rol": user["rol"]}), 200

# ======================
# 🔑 LOGIN
# ======================
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
        return jsonify({"success": True, "message": "Login exitoso", "rol": user['rol']}), 200

    return jsonify({"success": False, "message": "Usuario o contraseña incorrectos"}), 401

# ======================
# 🚪 LOGOUT
# ======================
@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop('user', None)
    return jsonify({"success": True, "message": "Logout exitoso"}), 200

# ======================
# 📝 REGISTER
# ======================
@app.route("/api/register", methods=["POST"])
def register_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Datos faltantes"}), 400

    email = data.get("email") or f"{data.get('username')}@local.test"
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Faltan username o password"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO usuarios (email, username, password, rol) VALUES (%s, %s, %s, %s)",
            (email, username, hashed_password, 'usuario')
        )
        conn.commit()
        return jsonify({"message": f"Usuario {username} agregado correctamente"}), 201
    except Exception as err:
        return jsonify({"error": f"Error de DB: {err}"}), 500
    finally:
        cursor.close()
        conn.close()

# ======================
# ⚙️ ADMIN
# ======================
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

# ======================
# ▶️ MAIN
# ======================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
