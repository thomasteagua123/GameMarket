// src/components/Clientes/Carrito.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Carrito.css";

export function Carrito() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("carrito")) || [];
    setCartItems(storedCart);
  }, []);

  const handleRemove = (game_id) => {
    const updatedCart = cartItems.filter((item) => item.game_id !== game_id);
    setCartItems(updatedCart);
    localStorage.setItem("carrito", JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("carrito");
  };

  const handleQuantityChange = (game_id, delta) => {
    const updatedCart = cartItems.map((item) =>
      item.game_id === game_id
        ? { ...item, cantidad: Math.max(item.cantidad + delta, 1) }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("carrito", JSON.stringify(updatedCart));
  };

  const payment = () => {
    if (cartItems.length === 0) return;
    localStorage.setItem("carrito", JSON.stringify(cartItems));
    navigate("/simular-compra");
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <div className="carrito-container">
      <div className="carrito-header">
        <button
          className=" volver-btn"
          onClick={() => navigate("/homeClientes")}
        >
          ← Volver a la tienda
        </button>
        <h2>🛒 Tu Carrito</h2>
      </div>

      {cartItems.length > 0 ? (
        <>
          <div className="carrito-items-list">
            {cartItems.map((item, index) => (
              <div key={`${item.game_id}-${index}`} className="carrito-item">
                <img
                  src={item.image_url}
                  alt={item.nombre}
                  className="carrito-img"
                />
                <div className="carrito-info">
                  <h3>{item.nombre}</h3>
                  <p>${item.precio}</p>
                </div>
                <div className="carrito-controles">
                  <button
                    className="btn-cantidad"
                    onClick={() => handleQuantityChange(item.game_id, -1)}
                  >
                    -
                  </button>
                  <span>{item.cantidad}</span>
                  <button
                    className="btn-cantidad"
                    onClick={() => handleQuantityChange(item.game_id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleRemove(item.game_id)}
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito-footer">
            <h3 className="carrito-total">Total: ${total}</h3>
            <div className="carrito-acciones">
              <button className="carrito-acciones" onClick={handleClearCart}>
                Vaciar Carrito
              </button>
              <button className="carrito-acciones" onClick={payment}>
                Pagar
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="carrito-vacio">Tu carrito está vacío.</p>
      )}
    </div>
  );
}
