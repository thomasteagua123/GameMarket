// Carrito.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(datos);
  }, []);

  const total = carrito.reduce(
    (acc, item) => acc + Number(item.precio) * item.cantidad,
    0
  );

  const irAPago = () => {
    // 👉 guardamos los datos de la compra antes de redirigir
    localStorage.setItem("compra", JSON.stringify({ carrito, total }));
    navigate("/simular-compra"); // 👈 redirige al formulario
  };

  return (
    <div className="carrito-container">
      <h2>🛒 Tu Carrito</h2>
      {carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul>
            {carrito.map((item, index) => (
              <li key={`${item.game_id}-${index}`}>
                {item.nombre} x{item.cantidad} - $
                {Number(item.precio).toFixed(2)}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total:</strong> ${total.toFixed(2)}
          </p>
          <button onClick={irAPago}>Ir a pago</button>
        </>
      )}
    </div>
  );
}

export default Carrito;
