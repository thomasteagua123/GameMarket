import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./home.css";

export function HomeClientes() {
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

      <div className="catalogo">
        <aside className="sidebar">
          <h3>Categorías</h3>
          <ul>
            <li>Acción</li>
            <li>Aventura</li>
            <li>RPG</li>
            <li>Deportes</li>
            <li>Simulación</li>
            <li>Shooter</li>
            <li>Lucha</li>
          </ul>
        </aside>

        <main>
          <h2 className="title">Lista de Juegos</h2>
          {isAdmin && (
            <div style={{ marginBottom: "20px" }}>
              <Link to="/clientes">
                <button>Ir a Panel de Clientes</button>
              </Link>
            </div>
          )}
          <ol className="games-grid">
            <li>Hollow Knight - Metroidvania / Plataformas ($79.99)</li>
            <li>The Legend of Zelda: Breath of the Wild - Aventura ($7.00)</li>
            <li>FIFA 24 - Deportes / Fútbol ($6.99)</li>
            <li>Elden Ring - RPG de acción / Mundo abierto ($42.99)</li>
            <li>Stardew Valley - Simulación / RPG ($21.99)</li>
            <li>Call of Duty: Modern Warfare II - Shooter ($19.99)</li>
            <li>Among Us - Party Game / Deductivo ($9.99)</li>
            <li>God of War - Acción y Aventura ($79.99)</li>
            <li>Minecraft - Aventura ($5.00)</li>
            <li>Mortal Kombat - Lucha ($35.97)</li>
          </ol>
        </main>
      </div>
    </div>
  );
}
