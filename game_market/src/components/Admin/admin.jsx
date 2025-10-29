import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin", { withCredentials: true })
      .then((res) => {
        setMessage(res.data.message);
        setError("");
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.error || "No autorizado");
        } else {
          setError("Error de conexión al servidor");
        }
        setMessage("");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );
      setMessage("");
      setError("Sesión cerrada.");
    } catch {
      setError("Error al cerrar sesión.");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "20px auto",
        padding: 20,
        border: "1px solid gray",
        borderRadius: 8,
      }}
    >
      <h2>Panel de Administración</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {message && (
        <button
          onClick={handleLogout}
          style={{
            marginTop: 20,
            padding: "10px 15px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Cerrar Sesión
        </button>
      )}
    </div>
  );
}

export default AdminPanel;
