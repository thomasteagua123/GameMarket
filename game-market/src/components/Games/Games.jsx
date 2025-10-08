import React from "react";
import "./games.css"; 

const games = [
  { id: 1, nombre: "Among Us", categoria: "Party", precio: 2200, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932257/Among_Us_portada_h8wqlp.jpg" },
  { id: 2, nombre: "Call of Duty Modern Warfare II", categoria: "Shooter", precio: 2300, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932264/Call_of_Duty_Modern_Warfare_II_portada_uacnzo.jpg" },
  { id: 3, nombre: "EA FC24", categoria: "Deportes", precio: 2300, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932258/EA_FC24_portada_wotsla.jpg" },
  { id: 4, nombre: "Elden Ring", categoria: "RPG", precio: 2300, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932257/Elden_Ring_portada_bcmnj7.jpg" },
  { id: 5, nombre: "God of War III", categoria: "Acción", precio: 2100, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932257/God_of_War_III_portada_k6tdji.jpg" },
  { id: 6, nombre: "Hollow Knight", categoria: "Aventura", precio: 2100, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932258/Hollow_Knight_portada_xrpypv.png" },
  { id: 7, nombre: "Hollow Knight Silksong first", categoria: "Aventura", precio: 2100, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932258/Hollow_Knight_Silksong_first_portada_yrp6wt.jpg" },
  { id: 8, nombre: "Logo of Stardew Valley", categoria: "Estrategia", precio: 2100, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932259/Logo_of_Stardew_Valley_ixk9lq.png" },
  { id: 9, nombre: "Minecraft", categoria: "Sandbox", precio: 1800, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932259/Minecraft_portada_mh8eho.png" },
  { id: 10, nombre: "Mortal Kombat 1", categoria: "Lucha", precio: 1800, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932259/Mortal_Kombat_1_portada_qp4dnq.jpg" },
  { id: 11, nombre: "Party Hard", categoria: "Indie", precio: 1800, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932259/Party_Hard-portada_ws3kfp.jpg" },
  { id: 12, nombre: "The Legend of Zelda Breath of the Wild", categoria: "Aventura", precio: 3500, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932259/The_Legend_of_Zelda_Breath_of_the_Wild-portada_gunk0g.jpg" },
];

export function Games({ filteredGames = [], handleAddToCart }) {
  const lista = filteredGames.length > 0 ? filteredGames : games;

  return (
    <div>
      <ul className="games-grid">
        {lista.map((game) => (
          <li key={game.id} className="game-item">
            <img
              src={game.img}
              alt={game.nombre}
              style={{
                width: "100%",
                borderRadius: "12px 12px 0 0",
                objectFit: "cover",
                maxHeight: "140px",
                marginBottom: "0.5rem",
              }}
            />
            <div style={{ padding: "0 0.5rem 0.5rem 0.5rem" }}>
              <h3>{game.nombre}</h3>
              <p>
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
    </div>
  );
}
