import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Clientes.css";
import SimularCompra from "./SimularCompra.jsx"; // 👈 Nuevo componente

export function Clientes() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/clients")
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos recibidos:", data);
        setClients(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const gastosPorCliente = clients.reduce((acc, client) => {
    if (!acc[client.client_id]) {
      acc[client.client_id] = {
        first_name: client.first_name,
        last_name: client.last_name,
        total: 0,
        games: [],
      };
    }
    acc[client.client_id].total += Number(client.price) || 0;
    acc[client.client_id].games.push(client.name);
    return acc;
  }, {});

  const clientesConTotal = Object.entries(gastosPorCliente).map(
    ([id, info]) => ({
      client_id: id,
      first_name: info.first_name,
      last_name: info.last_name,
      total: Number(info.total) || 0,
      games: info.games,
    })
  );

  const totalGeneral = clientesConTotal.reduce(
    (sum, client) => sum + client.total,
    0
  );

  if (!clients.length) {
    return (
      <div className="clientes-container">
        <header className="clientes-header">
          <h1>Panel de Clientes</h1>
        </header>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="clientes-container">
      <header className="clientes-header">
        <div className="header-top">
          <h1>Panel de Clientes</h1>
          <button class="botonA" type="button" onClick={() => navigate("/")}>
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
            <th>Juegos Comprados</th>
            <th>Total Gasto</th>
          </tr>
        </thead>
        <tbody>
          {clientesConTotal.map((client) => (
            <tr
              key={
                client.client_id || `${client.first_name}-${client.last_name}`
              }
            >
              <td>{client.client_id}</td>
              <td>{client.first_name}</td>
              <td>{client.last_name}</td>
              <td>{client.games.join(", ")}</td>
              <td>${Number(client.total).toFixed(2)}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>
              Total General:
            </td>
            <td style={{ fontWeight: "bold" }}>
              ${Number(totalGeneral).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;
