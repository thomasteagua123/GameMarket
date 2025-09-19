import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./home.css";

export function Home() {
  const [games, setGames] = useState([]);
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
      {/* 🔹 Header */}
      <header className="header">
        {user ? (
          <>
            <span style={{ marginRight: "10px" }}>
              Bienvenido, {user.email}!
            </span>
            <button className="register-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <button className="register-btn" onClick={() => navigate("/login")}>
            Registrarse
          </button>
        )}
      </header>

      {/* 🔹 Layout principal */}
      <div className="catalogo">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Categorías</h3>
          <ul>
            <li>
              <Link to="/categoria/Acción">Acción</Link>
            </li>
            <li>
              <Link to="/categoria/Aventura">Aventura</Link>
            </li>
            <li>
              <Link to="/categoria/RPG">RPG</Link>
            </li>
            <li>
              <Link to="/categoria/Deportes">Deportes</Link>
            </li>
            <li>
              <Link to="/categoria/Simulación">Simulación</Link>
            </li>
            <li>
              <Link to="/categoria/Shooter">Shooter</Link>
            </li>
            <li>
              <Link to="/categoria/Lucha">Lucha</Link>
            </li>
          </ul>
        </aside>

        {/* Contenido principal */}
        <main>
          <h2 className="title">Lista de Juegos</h2>

          {isAdmin && (
            <div style={{ marginBottom: "20px" }}>
              <Link to="/clientes">
                <button class="botonA">Ir a Panel de Clientes</button>
              </Link>
            </div>
          )}

          {/* 🔹 Render dinámico de juegos */}
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
    </div>
  );
}
