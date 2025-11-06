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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numberValidation = valid.number(cardData.number);
    const expiryValidation = valid.expirationDate(cardData.expiry);
    const cvcValidation = valid.cvv(cardData.cvc);

    if (!numberValidation.isValid) return alert("Número de tarjeta inválido");
    if (!expiryValidation.isValid) return alert("Fecha inválida");
    if (!cvcValidation.isValid) return alert("CVC inválido");

    // ✅ AHORA LEE EL CARRITO REAL
    const items = JSON.parse(localStorage.getItem("carrito")) || [];

    if (items.length === 0) {
      alert("El carrito está vacío.");
      return navigate("/homeClientes");
    }

    // ✅ Detectar tipo de tarjeta automáticamente
    const paymentMethod = numberValidation.card
      ? numberValidation.card.niceType
      : "Desconocida";

    const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const shipping = 0;
    const total = subtotal + shipping;
    const orderId = "GM-" + Date.now().toString().slice(-8);

    try {
      for (const item of items) {
        let juegoId = item.game_id !== undefined ? item.game_id : item.id;

        console.log("Enviando compra a backend:", {
          first_name: cardData.name.split(" ")[0],
          last_name: cardData.name.split(" ").slice(1).join(" "),
          game_id: juegoId,
          payment_method: paymentMethod,
        });

        await fetch("http://localhost:5000/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: cardData.name.split(" ")[0],
            last_name: cardData.name.split(" ").slice(1).join(" "),
            game_id: juegoId,
            payment_method: paymentMethod,
          }),
          credentials: "include",
        });
      }

      alert("Compra registrada con éxito 💳");
    } catch (error) {
      alert("Error al registrar la compra: " + error.message);
      return;
    }

    // ✅ AHORA BORRA EL CARRITO REAL
    localStorage.removeItem("carrito");

    navigate("/comprobante", {
      state: {
        orderId,
        date: new Date().toLocaleString(),
        items: items.map((i) => ({
          id: i.game_id !== undefined ? i.game_id : i.id,
          title: i.nombre,
          qty: i.cantidad,
          price: i.precio,
        })),
        subtotal,
        shipping,
        total,
        cardLast4: cardData.number.slice(-4),
        cardName: cardData.name,
        paymentMethod,
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
