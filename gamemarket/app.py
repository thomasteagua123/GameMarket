from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql.cursors
import bcrypt  # instalar con: pip install bcrypt

app = Flask(__name__)
# Clave secreta para sesiones
app.config['SECRET_KEY'] = 'mimamamemima123'

# 🔧 Habilitar CORS para React
CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173"]}},
    supports_credentials=True
)
# ---------------- PERFIL (verificación de sesión) ---------------- #
from flask import session

@app.route("/perfil", methods=["GET"])
def perfil_usuario():
    # Simulación: si hay usuario en sesión, devolver email
    email = session.get("user")
    if email:
        return jsonify({"email": email})
    else:
        return jsonify({"error": "No estás logueado"}), 401

# 🔗 Conexión a la DB con pymysql
def get_db_connection():
    conn = pymysql.connect(
        host="10.9.120.5",
        port=3306,
        user="gameMarket",
        password="game1234",
        database="gameMarket",
        cursorclass=pymysql.cursors.DictCursor  # 👈 ya devuelve diccionarios
    )
    return conn


@app.route("/")
def home():
    return "Bienvenido a GameMarket"


# ---------------- GAMES ---------------- #
@app.route("/api/games", methods=["GET"])
def get_games():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT game_id, name, category, price FROM games")
    games = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(games)

@app.route("/api/clients", methods=["GET"])
def get_client():
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



# ---------------- REGISTRO ---------------- #
@app.route('/api/usuarios', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Faltan username o password"}), 400

    # 🔒 Guardar el hash como string
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO usuarios (username, password) VALUES (%s, %s)",
            (username, hashed_password)
        )
        conn.commit()
        return jsonify({"message": f"Usuario {username} agregado correctamente"}), 201
    except Exception as err:
        return jsonify({"error": f"Error de DB: {err}"}), 500
    finally:
        cursor.close()
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

    # ✅ Comparar usando el hash guardado como string
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        # Guardar usuario en sesión para /perfil
        session['user'] = username
        return jsonify({"success": True, "message": "Login exitoso"})
    else:
        return jsonify({"success": False, "message": "Usuario o contraseña incorrectos"}), 401


# ---------------- RUN ---------------- #
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
