import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // La ruta de importación es crucial
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtiene la función login del contexto

  const admin = "admin123@gmail.com";
  const contra = "1234";

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === admin && password === contra) {
      login(email); // Llama a la función login del contexto
      setMessage("¡Login exitoso!");
      setTimeout(() => navigate("/"), 1500);
    } else if (email !== admin && password !== contra) {
      login(email);
      setMessage("¡Login exitoso!");
      setTimeout(() => navigate("/homeClientes"), 1500);
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
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
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
