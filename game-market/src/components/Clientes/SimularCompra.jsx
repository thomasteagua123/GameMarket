import { useState } from "react";
import valid from "card-validator";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./Clientes.css"

export default function PaymentForm({ onSuccess }) {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const navigate = useNavigate(); // Inicializar useNavigate

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

    alert("Pago aprobado (solo testing).");
    if (onSuccess) onSuccess(); // limpia carrito o continúa flujo

    // Redirigir al Home después de un pago exitoso
    navigate("/"); // Redirige a la ruta '/' (Home)
  };
  const home = ()=>{navigate("/homeClientes");}
  return (
    <div className="payment-form">
      <button class="botonI" onClick={home}>Volver al home</button>
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
        <button class="botonI" type="submit">Confirmar Pago</button>
      </form>
    </div>
  );
}
