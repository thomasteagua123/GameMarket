import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const admin = "admin123@gmail.com";
  const contra = "1234";

  const handleLogin = (e) => {
    e.preventDefault();

    // Validación del admin
    if (email === admin && password === contra) {
      login(email, password);
      setMessage("¡Login exitoso!");
      setTimeout(() => navigate("/"), 1500);
    }
    // Validación para clientes (ejemplo: cualquier otro email con su contraseña correcta)
    else if (email !== admin && password.trim() !== "") {
      // Aquí podrías hacer validación real contra tu base de datos o lista de usuarios
      login(email, password);
      setMessage("¡Login exitoso!");
      setTimeout(() => navigate("/homeClientes"), 1500);
    }
    // En caso de datos incorrectos
    else {
      setMessage("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <p className="subtitle">Sign in to your account</p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
              required
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
              required
            />
          </div>

          <a
            onClick={() => navigate("/forgot-password")}
            className="forgot-password"
            style={{ cursor: "pointer" }}
          >
            Forgot password?
          </a>

          <button type="submit" className="login-button">
            Login
          </button>

          {message && <p>{message}</p>}

          <p className="register-text">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="register-link"
              style={{ cursor: "pointer", color: "blue" }}
            >
              Register here
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

export default Login;
