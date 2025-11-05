import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Games } from "../Games/Games";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import "./home.css";

export function Home() {
  const [games, setGames] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/games")
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (user) {
    navigate("/homeClientes"); 
  }

  return (
    <div>
      <header className="header">
        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
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
            {user ? (
              <button className="register-btn" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            ) : (
              <button
                className="register-btn"
                onClick={() => navigate("/login")}
              >
                inicio sesión
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

        <Games />
      </main>

      {/* 🔻 FOOTER agregado aquí */}
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
