// src/components/Clientes/Comprobante.jsx
import { useLocation, useNavigate } from "react-router-dom";
import "./Clientes.css";

export default function Comprobante() {
  const location = useLocation();
  const navigate = useNavigate();

  // datos pasados desde navigate("/receipt", { state: {...} })
  const {
    orderId,
    date,
    items,
    subtotal,
    shipping,
    total,
    cardLast4,
    cardName,
  } = location.state || {};

  if (!location.state) {
    return (
      <div className="payment-form">
        <h2>No hay comprobante disponible</h2>
        <button className="botonI" onClick={() => navigate("/homeClientes")}>
          Volver al Home
        </button>
      </div>
    );
  }

  return (
    <div className="payment-form">
      <h2>Comprobante de compra</h2>
      <p>
        <strong>ID de Orden:</strong> {orderId}
      </p>
      <p>
        <strong>Fecha:</strong> {date}
      </p>
      <p>
        <strong>Tarjeta:</strong> **** **** **** {cardLast4}
      </p>
      <p>
        <strong>Titular:</strong> {cardName}
      </p>

      <h3>Productos:</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.title} x{item.qty} — ${item.price * item.qty}
          </li>
        ))}
      </ul>

      <h3>Resumen:</h3>
      <p>Subtotal: ${subtotal}</p>
      <p>Envío: ${shipping}</p>
      <p>
        <strong>Total: ${total}</strong>
      </p>

      <button className="botonI" onClick={() => navigate("/homeClientes")}>
        Volver al Home
      </button>
    </div>
  );
}
