import React, { useState } from 'react';
import './Login.css'

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin123@gmail.com' && password === '1234') {
      setMessage("¡login exitoso!");
    } else {
      setMessage("Usuario o contraseña incorrectos");
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

          <a href="#" className="forgot-password">Forgot password?</a>
          
          <button type="submit" className="login-button">Login</button>
          
          {message && <p>{message}</p>}
          
          <p className="register-text">
            Don't have an account? <a href="#" className="register-link">Register here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;