from flask import Flask, jsonify, request, session
from flask_cors import CORS
import pymysql.cursors
import bcrypt
import os
from dotenv import load_dotenv

# Cargar .env desde el proyecto raíz
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# ------------------------------------------------ #
# 🔑 FUNCIÓN CLAVE: Envuelve la aplicación para Testing y Flexibilidad
# ------------------------------------------------ #
def create_app(test_config=None):
    # 1. Crear instancia de Flask
    app = Flask(__name__)

    # 2. Configuración (desde .env o testing)
    app.config.from_mapping(
        SECRET_KEY=os.getenv('SUPER_KEY', 'change-me-default'),
        # AJUSTES CRÍTICOS PARA COOKIES EN DESARROLLO CORS
        SESSION_COOKIE_SAMESITE='None', 
        SESSION_COOKIE_SECURE=False,
        SESSION_COOKIE_HTTPONLY=True,
    )

    # Si se pasa una configuración de prueba, la aplica
    if test_config is not None:
        app.config.from_mapping(test_config)
    
    # 3. CONFIGURACIÓN CORS (Ahora dentro de la función)
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5174')
    # Definimos explícitamente los orígenes permitidos
    origins = [frontend_url, 'http://127.0.0.1:5174']

    CORS(
        app,
        resources={r"/*": {"origins": origins}},
        supports_credentials=True,
        # Define los encabezados permitidos para peticiones complejas
        allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"] 
    )


    # 🔗 Conexión a la DB con pymysql (La dejamos como función interna)
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


    # ---------------- RUTAS (Endpoints) ---------------- #
    # TODAS TUS RUTAS ORIGINALES VAN AQUÍ DENTRO

    @app.route("/")
    def home():
        return "Bienvenido a GameMarket"

    # ... [Todas tus rutas: perfil_usuario, get_games, get_clients, add_client, register_user, login_user, logout_user, admin_only] ...
    
    # ---------------- PERFIL (verificación de sesión) ---------------- #
    @app.route("/perfil", methods=["GET"])
    def perfil_usuario():
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
            return jsonify({"error": "No estás logueado"}), 401
            
    # [Para ahorrar espacio, asumimos que todas las demás rutas están aquí]
    # ... Tu ruta /api/games
    # ... Tu ruta /api/clients (GET y POST)
    # ... Tu ruta /api/register
    # ... Tu ruta /login
    # ... Tu ruta /logout
    # ... Tu ruta /admin
    
    # (Tu código completo de las rutas de tu último mensaje debe estar aquí)

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

    return app

# ---------------- EJECUCIÓN ---------------- #
if __name__ == "__main__":
    # Creamos la instancia de la app para correrla en desarrollo
    app = create_app()
    # Ejecutamos la app
    app.run(host="0.0.0.0", port=5000, debug=True)
