import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
              <>
                <button className="register-btn" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <button
                className="register-btn"
                onClick={() => navigate("/login")}
              >
                Registrarse
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

        <ul className="games-grid">
          {games.length > 0 ? (
            games.map((game) => (
              <li key={game.game_id}>
                {game.name} - {game.category} (${game.price})
              </li>
            ))
          ) : (
            <p>No hay juegos disponibles</p>
          )}
        </ul>
      </main>
    </div>
  );
}
