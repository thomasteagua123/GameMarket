import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Receipt.css";

export default function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  // Si no vienen datos, podés redirigir al homeClientes
  const data = location.state || {};

  // Estructura esperada (ejemplo):
  // data = { orderId, date, items: [{id, title, price, qty, img}], subtotal, shipping, total, cardLast4, cardName }

  // si no hay items mostramos un mensaje
  if (!data.items || data.items.length === 0) {
    return (
      <div className="receipt-container">
        <div className="receipt-card">
          <h2>Comprobante de compra</h2>
          <p>No se encontraron datos de la compra.</p>
          <button className="botonI" onClick={() => navigate("/homeClientes")}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (n) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(n);

  return (
    <div className="receipt-container">
      <div className="receipt-card" id="printable-area">
        <header className="receipt-header">
          <div className="brand">
            <img src="/logo.png" alt="logo" className="receipt-logo" />
            <div>
              <h3>GameMarket</h3>
              <small>Comprobante de compra</small>
            </div>
          </div>
          <div className="meta">
            <div>
              <strong>Orden:</strong> {data.orderId}
            </div>
            <div>
              <strong>Fecha:</strong> {data.date || new Date().toLocaleString()}
            </div>
            <div>
              <strong>Estado:</strong> Pago aprobado
            </div>
          </div>
        </header>

        <main className="receipt-body">
          <section className="items-list">
            {data.items.map((it) => (
              <div key={it.id} className="item-row">
                <div className="item-left">
                  {it.img ? (
                    <img src={it.img} alt={it.title} className="item-img" />
                  ) : (
                    <div className="item-img placeholder">Img</div>
                  )}
                  <div>
                    <div className="item-title">{it.title}</div>
                    <div className="item-qty">Cantidad: {it.qty}</div>
                  </div>
                </div>
                <div className="item-right">
                  <div className="item-price">
                    {formatCurrency(it.price * it.qty)}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>
                {formatCurrency(
                  data.subtotal ||
                    data.items.reduce((s, i) => s + i.price * i.qty, 0)
                )}
              </span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>{formatCurrency(data.shipping ?? 0)}</span>
            </div>
            <div className="summary-row total">
              <span>Total pagado</span>
              <span>
                {formatCurrency(
                  data.total ?? (data.subtotal ?? 0) + (data.shipping ?? 0)
                )}
              </span>
            </div>

            <div className="payment-info">
              <strong>Pago con tarjeta</strong>
              <div>{data.cardName || "Titular desconocido"}</div>
              <div>**** **** **** {data.cardLast4 || "0000"}</div>
            </div>
          </section>

          <section className="help">
            <p>
              Gracias por tu compra. Si necesitás ayuda, contactanos a
              soporte@gamemarket.example
            </p>
          </section>
        </main>

        <footer className="receipt-footer">
          <button className="botonI" onClick={() => window.print()}>
            Imprimir / Guardar PDF
          </button>
          <button
            className="botonI"
            onClick={() => navigate("/homeClientes")}
            style={{ marginLeft: "10px", backgroundColor: "#6b7280" }}
          >
            Volver al Home
          </button>
        </footer>
      </div>
    </div>
  );
}
