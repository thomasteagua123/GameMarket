import { useEffect, useState } from "react";
import './home.css'

export function Home() {
const [games, setGames] = useState([]);

useEffect(() => {
  fetch("http://127.0.0.1:5000/api/games")  // ruta de Flask
    .then((res) => res.json())
    .then((data) => setGames(data))
    .catch((err) => console.error(err));
}, []);

return (
  <div>
<header className="header">
  <button className="register-btn">Registrarse</button>
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


