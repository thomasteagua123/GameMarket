from flask import Flask, jsonify, request, session
from flask_cors import CORS
import pymysql.cursors
import bcrypt
import os
from dotenv import load_dotenv

# Cargar .env desde el proyecto raíz
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__)

# Clave secreta para sesiones
app.config['SECRET_KEY'] = os.getenv('SUPER_KEY', 'change-me')

# 💡 AJUSTES CRÍTICOS PARA COOKIES EN DESARROLLO CORS
# 1. Necesario para que el navegador envíe cookies entre diferentes puertos de localhost.
app.config['SESSION_COOKIE_SAMESITE'] = 'None' 
# 2. Debe ser False en HTTP (localhost)
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True 
# No es necesario especificar DOMAIN en localhost:
# app.config['SESSION_COOKIE_DOMAIN'] = 'localhost' 


# 🔧 Habilitar CORS para React
frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5174') # 💡 Usando 5174 como se ve en tu error
origins = [frontend_url, 'http://127.0.0.1:5174']

# 💡 CAMBIO CLAVE: Cuando supports_credentials=True, CORS(app, ...) DEBE USAR UNA LISTA 
# DE ORÍGENES ESPECÍFICOS Y NO PUEDE USAR EL COMODÍN "*" EN EL ENCABEZADO.
# Tu configuración actual es correcta, pero la simplificamos para asegurar que no haya conflictos.
CORS(
    app,
    resources={r"/*": {"origins": origins}}, # Permite solicitudes a todas las rutas desde tus orígenes
    supports_credentials=True,              # Permite cookies y encabezados de autorización
    allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"] # Headers explícitos
)


# 🔗 Conexión a la DB con pymysql
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


# ---------------- PERFIL (verificación de sesión) ---------------- #
@app.route("/perfil", methods=["GET"])
def perfil_usuario():
   # Aquí se comprueba si la cookie de sesión fue enviada por el navegador
   email = session.get("user") 
   if email:
       # Obtener rol de BD
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
       # Si session.get("user") es None, la cookie no llegó o no es válida.
       return jsonify({"error": "No estás logueado"}), 401


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

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insertar cliente
        cursor.execute(
            "INSERT INTO client (first_name, last_name, game_id) VALUES (%s, %s, %s)",
            (first_name, last_name, game_id)
        )
        client_id = cursor.lastrowid

        # Insertar compra con método de pago
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
        cursor.close()
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


   hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


   try:
       conn = get_db_connection()
       cursor = conn.cursor()
       cursor.execute(
           "INSERT INTO usuarios (email, username, password, rol) VALUES (%s, %s, %s, %s)",
           (email, username, hashed_password, 'usuario')  # rol por defecto usuario
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


   if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
       # Si el login es exitoso, Flask establece la cookie de sesión
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


if __name__ == "__main__":
   # 💡 Usar 0.0.0.0 asegura que la aplicación sea accesible en la red local si es necesario
   app.run(host="0.0.0.0", port=5000, debug=True)
