// src/components/Clientes/SimularCompra.jsx
import { useState } from "react";
import valid from "card-validator";
import { useNavigate } from "react-router-dom";
import "./Clientes.css";

export default function SimularCompra() {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const numberValidation = valid.number(cardData.number);
    const expiryValidation = valid.expirationDate(cardData.expiry);
    const cvcValidation = valid.cvv(cardData.cvc);

    if (!numberValidation.isValid) return alert("Número de tarjeta inválido");
    if (!expiryValidation.isValid) return alert("Fecha inválida");
    if (!cvcValidation.isValid) return alert("CVC inválido");

    // ✅ Obtener carrito real
    const items = JSON.parse(sessionStorage.getItem("carrito")) || [];
    if (items.length === 0) {
      alert("El carrito está vacío.");
      return navigate("/homeClientes");
    }

    // Calcular totales
    const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const shipping = 0;
    const total = subtotal + shipping;
    const orderId = "GM-" + Date.now().toString().slice(-8);

    // ✅ Limpiar carrito después del pago
    sessionStorage.removeItem("carrito");

    // Redirigir al comprobante
    navigate("/comprobante", {
      state: {
        orderId,
        date: new Date().toLocaleString(),
        items: items.map((i) => ({
          id: i.game_id,
          title: i.nombre,
          qty: i.cantidad,
          price: i.precio,
        })),
        subtotal,
        shipping,
        total,
        cardLast4: cardData.number.slice(-4),
        cardName: cardData.name,
      },
    });
  };

  const home = () => {
    navigate("/homeClientes");
  };

  return (
    <div className="payment-form">
      <button className="botonI" onClick={home}>
        Volver al home
      </button>
      <h2>Datos de la tarjeta</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          name="number"
          placeholder="Número de tarjeta"
          value={cardData.number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Nombre en la tarjeta"
          value={cardData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="expiry"
          placeholder="MM/AA"
          value={cardData.expiry}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="cvc"
          placeholder="CVC"
          value={cardData.cvc}
          onChange={handleChange}
          required
        />
        <button className="botonI" type="submit">
          Confirmar Pago
        </button>
      </form>
    </div>
  );
}
