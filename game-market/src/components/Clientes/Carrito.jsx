// src/components/Clientes/Carrito.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Carrito() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("carrito")) || [];
    setCartItems(storedCart);
  }, []);

  const handleRemove = (game_id) => {
    const updatedCart = cartItems.filter((item) => item.game_id !== game_id);
    setCartItems(updatedCart);
    sessionStorage.setItem("carrito", JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    setCartItems([]);
    sessionStorage.removeItem("carrito");
  };

  return (
    <div style={{ padding: "20px" }}>
      <button className="botonI" onClick={() => navigate("/homeClientes")}>
        Volver a la tienda
      </button>
      <h2>🛒 Tu Carrito</h2>
      {cartItems.length > 0 ? (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li
                key={`${item.game_id}-${index}`}
                style={{ marginBottom: "10px" }}
              >
                {item.nombre} x {item.cantidad} (${item.precio * item.cantidad})
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleRemove(item.game_id)}
                >
                  ❌ Eliminar
                </button>
              </li>
            ))}
          </ul>
          <h3>
            Total: $
            {cartItems.reduce(
              (sum, item) => sum + item.precio * item.cantidad,
              0
            )}
          </h3>
          <button onClick={handleClearCart}>Vaciar Carrito</button>
        </>
      ) : (
        <p>Tu carrito está vacío.</p>
      )}
    </div>
  );
}
