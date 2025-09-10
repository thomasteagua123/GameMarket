// src/components/Clientes.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Clientes.css"; // Importa tu CSS

function Clientes() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="clientes-container">
      <header className="clientes-header">
        <div className="header-top">
          <h1>Panel de Clientes</h1>
          <button
            type="button"
            className="volverHome"
            onClick={() => navigate("/")}
          >
            Volver al Home
          </button>
        </div>
        <p>Gestiona los ingresos y compras de tus clientes.</p>
      </header>

      <table className="clientes-table">
        <thead>
          <tr>
            <th>ID Cliente</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Juego</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.client_id}>
              <td>{client.client_id}</td>
              <td>{client.first_name}</td>
              <td>{client.last_name}</td>
              <td>{client.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;
