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

  const admin = "admin1234@gmail.com";
  const contra = "1234";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === admin && password === contra) {
      const success = await login(email, password);
      if (success) {
        setMessage("¡Login exitoso!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage("Error en el login");
      }
    } else if (email !== admin && password.trim() !== "") {
      const success = await login(email, password);
      if (success) {
        setMessage("¡Login exitoso!");
        setTimeout(() => navigate("/homeClientes"), 1500);
      } else {
        setMessage("Error en el login");
      }
    } else {
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
