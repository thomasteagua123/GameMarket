import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Clientes.css";
import animacionPago from "../../assets/aniamciondepago.mp4"; // 👈 ruta del video

export default function Comprobante() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(true);

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

  // Si no hay datos, mostrar mensaje de error
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

  // Al terminar la animación, mostrar el comprobante
  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 3500); // 3.5s de animación
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="payment-form" style={{ textAlign: "center" }}>
      {showAnimation ? (
        <video
          src={animacionPago}
          autoPlay
          muted
          playsInline
          style={{
            width: "300px",
            borderRadius: "20px",
            margin: "auto",
            display: "block",
          }}
          onEnded={() => setShowAnimation(false)}
        />
      ) : (
        <>
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

          {/* ✅ Botón para descargar en PDF */}
          <button
            className="botonI"
            onClick={() => window.print()}
            style={{ marginRight: "10px" }}
          >
            Descargar comprobante (PDF)
          </button>

          <button className="botonI" onClick={() => navigate("/homeClientes")}>
            Volver al Home
          </button>
        </>
      )}
    </div>
  );
}
