from flask import Flask, jsonify, request, session
from flask_cors import CORS
import pymysql.cursors
import bcrypt
import os
from dotenv import load_dotenv

# Cargar .env desde el proyecto raíz
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__)

app.config.from_mapping(
    SECRET_KEY=os.getenv('SUPER_KEY', 'change-me-default'),
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_SECURE=False,
    SESSION_COOKIE_HTTPONLY=True,
)

frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5174')
origins = [frontend_url, 'http://127.0.0.1:5174']

CORS(
    app,
    resources={r"/*": {"origins": origins}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"]
)

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

@app.route("/")
def home():
    return "Bienvenido a GameMarket"

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
        return jsonify({"error": "No estás logueado"}), 401

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

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Faltan username o password"}), 400

    if not email:
        email = f"{username}@local.test"

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
