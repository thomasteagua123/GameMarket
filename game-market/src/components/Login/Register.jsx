import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // puedes usar el mismo CSS

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Debes ingresar usuario y contraseña");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/usuarios?username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Usuario agregado correctamente
        setTimeout(() => navigate("/login"), 1500); // después de 1.5s vuelve al login
      } else {
        setMessage(data.error || "Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setMessage("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register</h2>
        <p className="subtitle">Create a new account</p>

        <form className="login-form" onSubmit={handleRegister}>
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username"
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
          </div>

          <button type="submit" className="login-button">
            Register
          </button>

          {message && <p>{message}</p>}

          <p className="register-text">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="register-link"
              style={{ cursor: "pointer", color: "blue" }}
            >
              Login here
            </span>
          </p>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/")}
          >
            Volver al Home
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
