import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Games } from "../Games/Games";
import { useGames } from "../../hooks/useGames";
import "./home.css";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export function Home() {
  const [filteredGames, setFilteredGames] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const {  isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const games = useGames();


/*  useEffect(() => {
    setFilteredGames(games);
  }, [games]);
*/
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("carrito")) || [];
    setCartItems(storedCart);
    setCartCount(storedCart.reduce((sum, item) => sum + item.cantidad, 0));
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = games.filter(
      (game) =>
        game.nombre.toLowerCase().includes(term) ||
        game.categoria.toLowerCase().includes(term)
    );
    // console.log(games)
    // console.log('filtered', filtered)
    setFilteredGames(filtered);
  };

  const handleAddToCart = (game) => {
    let updatedCart;
    const existing = cartItems.find((item) => item.game_id === game.id);

    if (existing) {
      updatedCart = cartItems.map((item) =>
        item.game_id === game.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          game_id: game.id,
          nombre: game.nombre,
          precio: game.precio,
          cantidad: 1,
        },
      ];
    }

    localStorage.setItem("carrito", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    setCartCount(updatedCart.reduce((sum, item) => sum + item.cantidad, 0));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const irAlCarrito = () => {
    navigate("/carrito");
  };

  return (
    <div>
      <header className="header">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          &#9776;
        </button>

        <nav className={`menu ${menuOpen ? "open" : ""}`}>
          <ul className="categories">
            <li>
              <Link to="/categoria/Acción" onClick={() => setMenuOpen(false)}>
                Acción
              </Link>
            </li>
            <li>
              <Link to="/categoria/Aventura" onClick={() => setMenuOpen(false)}>
                Aventura
              </Link>
            </li>
            <li>
              <Link to="/categoria/RPG" onClick={() => setMenuOpen(false)}>
                RPG
              </Link>
            </li>
            <li>
              <Link to="/categoria/Deportes" onClick={() => setMenuOpen(false)}>
                Deportes
              </Link>
            </li>
            <li>
              <Link
                to="/categoria/Simulación"
                onClick={() => setMenuOpen(false)}
              >
                Simulación
              </Link>
            </li>
            <li>
              <Link to="/categoria/Shooter" onClick={() => setMenuOpen(false)}>
                Shooter
              </Link>
            </li>
            <li>
              <Link to="/categoria/Lucha" onClick={() => setMenuOpen(false)}>
                Lucha
              </Link>
            </li>
          </ul>
          <hr />
          <ul className="account">
            {user ? (
              <>
                <li>
                  <span>Bienvenido, {user.email}</span>
                </li>
                <li>
                  <button onClick={handleLogout}>Cerrar Sesión</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={() => setMenuOpen(false)}>
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {!menuOpen && (
          <>
            <input
              type="text"
              placeholder="Buscar juegos..."
              onChange={handleSearch}
              className="buscar-input"
            />
            {user && (
              <button className="carrito-btn" onClick={irAlCarrito}>
                <video
                  src="/carro.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                />
              </button>
            )}
          </>
        )}
      </header>

      <main>
        <h2 className="title">Lista de Juegos</h2>

        {isAdmin && (
          <div style={{ marginBottom: "20px" }}>
            <Link to="/clientes">
              <button className="botonA">Ir a Panel de Clientes</button>
            </Link>
          </div>
        )}
        <Games
          filteredGames={filteredGames}
          handleAddToCart={handleAddToCart}
          games={games}
        />
      </main>
      <footer className="footer">
        <div className="footer-item">
          <FaWhatsapp className="icon" />
          <span className="text">+54 9 11 5229 7349</span>
        </div>
        <div className="footer-item">
          <FaInstagram className="icon" />
          <span className="text">@gameMarket_ok</span>
        </div>
      </footer>
    </div>
  );
}
