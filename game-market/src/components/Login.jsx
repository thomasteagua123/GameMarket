import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5173/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ username, password }),
});


      let data;
try {
  data = await response.json();
} catch (e) {
  console.error("No se pudo parsear JSON", e);
  data = { success: false, message: "Respuesta inválida del servidor" };
}


      if (response.ok) {
        setMessage(data.message);
        // Aquí puedes redirigir a otra página si el login es exitoso
        // por ejemplo: window.location.href = "/dashboard";
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error en la conexión al servidor");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
