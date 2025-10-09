import React, { useState } from "react";
import "./games.css";

const games = [
  { id: 1, nombre: "Among Us", categoria: "Party", precio: 2200, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932257/Among_Us_portada_h8wqlp.jpg" },
  { id: 2, nombre: "Call of Duty Modern Warfare II", categoria: "Shooter", precio: 2300, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932264/Call_of_Duty_Modern_Warfare_II_portada_uacnzo.jpg" },
  { id: 3, nombre: "EA FC24", categoria: "Deportes", precio: 2300, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932258/EA_FC24_portada_wotsla.jpg" },
  { id: 4, nombre: "Elden Ring", categoria: "RPG", precio: 2300, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932257/Elden_Ring_portada_bcmnj7.jpg" },
  { id: 5, nombre: "God of War III", categoria: "Acción", precio: 2100, img: "" },
  { id: 6, nombre: "Hollow Knight", categoria: "Aventura", precio: 2100, img: "" },
  { id: 7, nombre: "Hollow Knight Silksong", categoria: "Aventura", precio: "" },
  { id: 8, nombre: "Stardew Valley", categoria: "Estrategia", precio: 2100, img: "" },
  { id: 9, nombre: "Minecraft", categoria: "Sandbox", precio: 1800, img: "" },
  { id: 10, nombre: "Mortal Kombat 1", categoria: "Lucha", precio: 1800, img: "" },
  { id: 11, nombre: "Party Hard", categoria: "Indie", precio: 1800, img: "" },
  { id: 12, nombre: "The Legend of Zelda: Breath of the Wild", categoria: "Aventura", precio: 3500, img: "" },
  { id: 13, nombre: "Grand Theft Auto V", categoria: "Acción / Mundo abierto", precio: 3500, img: "" },
  { id: 14, nombre: "Spider-Man", categoria: "Aventura", precio: 3300, img: "" },
  { id: 15, nombre: "Cyberpunk 2077", categoria: "RPG / Acción", precio: 3200, img: "" },
  { id: 16, nombre: "League of Legends", categoria: "MOBA / Estrategia", precio: 2500, img: "" },
  { id: 17, nombre: "No Man's Sky", categoria: "Aventura / Acción", precio: 2200, img: "" },
  { id: 18, nombre: "Counter Strike: Global Offensive", categoria: "Shooter", precio: 2100, img: "" },
  { id: 19, nombre: "Red Dead Redemption 2", categoria: "Aventura / Acción", precio: 3500, img: "" },
  { id: 20, nombre: "Pokémon GO", categoria: "Aventura / AR", precio: 1500, img: "" },
  { id: 21, nombre: "Fortnite", categoria: "Battle Royale", precio: 1900, img: "" },
  { id: 22, nombre: "Super Smash Bros Ultimate", categoria: "Lucha / Party", precio: 3200, img: "" },
  { id: 23, nombre: "Just Dance 2024", categoria: "Baile", precio: 2000, img: "" },
  { id: 24, nombre: "Diablo IV", categoria: "RPG / Acción", precio: 3400, img: "" },
  { id: 25, nombre: "The Witcher 3: Wild Hunt", categoria: "Aventura / RPG", precio: 3300, img: "" },
  { id: 26, nombre: "FIFA 24", categoria: "Deportes", precio: 2300, img: "" },
  { id: 27, nombre: "Animal Crossing: New Horizons", categoria: "Simulación / Social", precio: 2700, img: "" },
  { id: 28, nombre: "Hades", categoria: "Acción / Roguelike", precio: 2000, img: "" },
  { id: 29, nombre: "Gran Turismo 7", categoria: "Carreras / Simulación", precio: 2600, img: "" },
  { id: 30, nombre: "Mario Kart 8 Deluxe", categoria: "Carreras / Familiar", precio: 2800, img: "" },
  { id: 31, nombre: "The Witcher 3: Wild Hunt", categoria: "RPG / Aventura", precio: 4500, img: "" },
  { id: 32, nombre: "Valorant", categoria: "Shooter / Táctico", precio: 0, img: "" },
  { id: 33, nombre: "Overwatch 2", categoria: "Shooter / Héroes", precio: 0, img: "" },
  { id: 34, nombre: "Assassin’s Creed Valhalla", categoria: "Aventura / Acción", precio: 3400, img: "" },
  { id: 35, nombre: "Resident Evil 4 Remake", categoria: "Terror / Acción", precio: 3500, img: "" },
  { id: 36, nombre: "The Sims 4", categoria: "Simulación / Social", precio: 2500, img: "" },
  { id: 37, nombre: "Dota 2", categoria: "MOBA / Estrategia", precio: 0, img: "" },
  { id: 38, nombre: "Starfield", categoria: "Ciencia ficción / RPG", precio: 3600, img: "" },
  { id: 39, nombre: "Baldur’s Gate 3", categoria: "RPG / Fantasía", precio: 3700, img: "" },
  { id: 40, nombre: "Terraria", categoria: "Aventura / Sandbox", precio: 1800, img: "" },
  { id: 41, nombre: "Left 4 Dead 2", categoria: "Cooperativo / Shooter", precio: 1600, img: "" },
  { id: 42, nombre: "Rocket League", categoria: "Deportes / Autos", precio: 2100, img: "" },
];

export function Games({ filteredGames = [], handleAddToCart }) {
  const lista = filteredGames.length > 0 ? filteredGames : games;

  // 🔹 PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // juegos por página
  const totalPages = Math.ceil(lista.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGames = lista.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="games-container">
      <ul className="games-grid">
        {currentGames.map((game) => (
          <li key={game.id} className="game-item">
            <img
              src={game.img || "https://via.placeholder.com/200x250?text=Sin+imagen"}
              alt={game.nombre}
              className="game-img"
            />
            <div className="game-info">
              <h3 className="game-title">{game.nombre}</h3>
              <p className="game-details">
                {game.categoria} - ${game.precio.toLocaleString()}
              </p>
              <button
                className="agregar-btn"
                onClick={() => handleAddToCart(game)}
              >
                Agregar al carrito
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 🔹 Controles de paginación */}
      <div className="pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          ◀ Anterior
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Siguiente ▶
        </button>
      </div>
    </div>
  );
}
