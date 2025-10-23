import React, { useState } from "react";
// El archivo games.css es requerido para el estilo del popover
// import "./games.css"; 

// 💡 LISTA DE JUEGOS CON DESCRIPCIONES Y PLATAFORMAS DETALLADAS
const games = [
  {
    id: 1,
    nombre: "Among Us",
    categoria: "Party",
    precio: 2200,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932257/Among_Us_portada_h8wqlp.jpg",
    descripcion: "Juego de deducción social. Los tripulantes buscan al impostor que intenta sabotear la nave.",
    plataforma: "PC, Consola, Móvil",
  },
  {
    id: 2,
    nombre: "Call of Duty Modern Warfare II",
    categoria: "Shooter",
    precio: 2300,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932264/Call_of_Duty_Modern_Warfare_II_portada_uacnzo.jpg",
    descripcion: "La última entrega de acción militar. Campaña inmersiva y modos multijugador intensos.",
    plataforma: "PC, PS5, Xbox Series X/S",
  },
  {
    id: 3,
    nombre: "EA FC24",
    categoria: "Deportes",
    precio: 2300,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932258/EA_FC24_portada_wotsla.jpg",
    descripcion: "El simulador de fútbol más realista, con miles de jugadores y modos de juego Ultimate Team.",
    plataforma: "Todas las consolas y PC",
  },
  {
    id: 4,
    nombre: "Elden Ring",
    categoria: "RPG",
    precio: 2300,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932257/Elden_Ring_portada_bcmnj7.jpg",
    descripcion: "Épico RPG de acción en un vasto mundo abierto de fantasía oscura con alto desafío.",
    plataforma: "PC, PS4/5, Xbox One/Series",
  },
  {
    id: 5,
    nombre: "God of War III",
    categoria: "Acción",
    precio: 2100,
    img: "https://placehold.co/200x250/505050/FFFFFF?text=GOW+III",
    descripcion: "Kratos busca venganza contra los dioses del Olimpo en una brutal aventura mitológica.",
    plataforma: "PS4, PS Now",
  },
  {
    id: 6,
    nombre: "Hollow Knight",
    categoria: "Aventura",
    precio: 2100,
    img: "https://placehold.co/200x250/2E86C1/FFFFFF?text=Hollow+Knight",
    descripcion: "Un hermoso metroidvania en 2D con un estilo artístico único y exploración profunda.",
    plataforma: "PC, Switch, PS4, Xbox One",
  },
  {
    id: 7,
    nombre: "Hollow Knight Silksong",
    categoria: "Aventura",
    precio: "2500 (Estimado)",
    img: "https://placehold.co/200x250/1976D2/FFFFFF?text=Silksong",
    descripcion: "La secuela del aclamado Hollow Knight, siguiendo la historia de Hornet.",
    plataforma: "PC, Switch, PS5, Xbox Series X/S",
  },
  {
    id: 8,
    nombre: "Stardew Valley",
    categoria: "Estrategia",
    precio: 2100,
    img: "https://placehold.co/200x250/76D7C4/333333?text=Stardew",
    descripcion: "Simulador de vida y granja. Crea tu hogar, cultiva y explora las cuevas.",
    plataforma: "PC, Consola, Móvil",
  },
  { id: 9, nombre: "Minecraft", categoria: "Sandbox", precio: 1800, img: "https://placehold.co/200x250/9ccc65/333333?text=Minecraft", descripcion: "Explora mundos infinitos, construye refugios y lucha contra criaturas nocturnas.", plataforma: "Todas las plataformas"},
  {
    id: 10,
    nombre: "Mortal Kombat 1",
    categoria: "Lucha",
    precio: 1800,
    img: "https://placehold.co/200x250/C0392B/FFFFFF?text=MK+1",
    descripcion: "Reinicio del universo MK con nuevas mecánicas de lucha y fatalities brutales.",
    plataforma: "PC, PS5, Xbox Series X/S",
  },
  { id: 11, nombre: "Party Hard", categoria: "Indie", precio: 1800, img: "https://placehold.co/200x250/7D3C98/FFFFFF?text=Party+Hard", descripcion: "Un juego de sigilo y estrategia donde tu misión es detener las ruidosas fiestas.", plataforma: "PC, Consola"},
  {
    id: 12,
    nombre: "The Legend of Zelda: Breath of the Wild",
    categoria: "Aventura",
    precio: 3500,
    img: "https://placehold.co/200x250/2C3E50/FFFFFF?text=Zelda+BOTW",
    descripcion: "Explora el vasto reino de Hyrule con total libertad. Un clásico de Switch.",
    plataforma: "Nintendo Switch",
  },
  {
    id: 13,
    nombre: "Grand Theft Auto V",
    categoria: "Acción / Mundo abierto",
    precio: 3500,
    img: "https://placehold.co/200x250/F39C12/FFFFFF?text=GTA+V",
    descripcion: "Juego de acción en mundo abierto con tres protagonistas. Incluye GTA Online.",
    plataforma: "PC, PS4/5, Xbox One/Series",
  },
  {
    id: 14,
    nombre: "Spider-Man",
    categoria: "Aventura",
    precio: 3300,
    img: "https://placehold.co/200x250/E74C3C/FFFFFF?text=Spider-Man",
    descripcion: "Balanceate por Nueva York como Peter Parker. Combate fluido y cinemático.",
    plataforma: "PS4, PC",
  },
  {
    id: 15,
    nombre: "Cyberpunk 2077",
    categoria: "RPG / Acción",
    precio: 3200,
    img: "https://placehold.co/200x250/F1C40F/333333?text=Cyberpunk+2077",
    descripcion: "Un RPG futurista en Night City. Elige tu camino y mejora tu personaje con implantes.",
    plataforma: "PC, PS5, Xbox Series X/S",
  },
  {
    id: 16,
    nombre: "League of Legends",
    categoria: "MOBA / Estrategia",
    precio: 2500,
    img: "https://placehold.co/200x250/3498DB/FFFFFF?text=LoL",
    descripcion: "El MOBA más popular del mundo. Combate 5v5 para destruir el nexo enemigo.",
    plataforma: "PC",
  },
  {
    id: 17,
    nombre: "No Man's Sky",
    categoria: "Aventura / Acción",
    precio: 2200,
    img: "https://placehold.co/200x250/8E44AD/FFFFFF?text=NMS",
    descripcion: "Exploración infinita de un universo generado proceduralmente. Construye bases y comercia.",
    plataforma: "PC, Consola",
  },
  {
    id: 18,
    nombre: "Counter Strike: Global Offensive",
    categoria: "Shooter",
    precio: 2100,
    img: "https://placehold.co/200x250/2C3E50/FFFFFF?text=CS:GO",
    descripcion: "Shooter táctico 5v5 centrado en la precisión y el trabajo en equipo.",
    plataforma: "PC",
  },
  {
    id: 19,
    nombre: "Red Dead Redemption 2",
    categoria: "Aventura / Acción",
    precio: 3500,
    img: "https://placehold.co/200x250/A93226/FFFFFF?text=RDR+2",
    descripcion: "Un épico del Viejo Oeste. Gráficos impresionantes y una historia profunda en un mundo vasto.",
    plataforma: "PC, PS4, Xbox One",
  },
  {
    id: 20,
    nombre: "Pokémon GO",
    categoria: "Aventura / AR",
    precio: 1500,
    img: "https://placehold.co/200x250/F4D03F/333333?text=Pokemon+GO",
    descripcion: "Captura Pokémon en el mundo real usando la realidad aumentada.",
    plataforma: "Móvil (iOS, Android)",
  },
  {
    id: 21,
    nombre: "Fortnite",
    categoria: "Battle Royale",
    precio: 1900,
    img: "https://placehold.co/200x250/1ABC9C/FFFFFF?text=Fortnite",
    descripcion: "El popular Battle Royale que combina disparos, construcción y eventos en vivo.",
    plataforma: "PC, Consola, Móvil",
  },
  {
    id: 22,
    nombre: "Super Smash Bros Ultimate",
    categoria: "Lucha / Party",
    precio: 3200,
    img: "https://placehold.co/200x250/E74C3C/FFFFFF?text=Smash+Bros",
    descripcion: "El juego de lucha de plataforma definitivo con personajes icónicos de Nintendo.",
    plataforma: "Nintendo Switch",
  },
  {
    id: 23,
    nombre: "Just Dance 2024",
    categoria: "Baile",
    precio: 2000,
    img: "https://placehold.co/200x250/8E44AD/FFFFFF?text=Just+Dance",
    descripcion: "Sigue los movimientos en pantalla y baila al ritmo de los éxitos del momento.",
    plataforma: "Consola (Switch, PS5, Xbox Series X/S)",
  },
  {
    id: 24,
    nombre: "Diablo IV",
    categoria: "RPG / Acción",
    precio: 3400,
    img: "https://placehold.co/200x250/2C3E50/FFFFFF?text=Diablo+IV",
    descripcion: "RPG de acción con perspectiva isométrica. Lucha contra hordas demoníacas.",
    plataforma: "PC, PS5, Xbox Series X/S",
  },
  {
    id: 25,
    nombre: "The Witcher 3: Wild Hunt",
    categoria: "Aventura / RPG",
    precio: 3300,
    img: "https://placehold.co/200x250/3498DB/FFFFFF?text=Witcher+3",
    descripcion: "Sé Geralt de Rivia, un cazador de monstruos. Gran narrativa y mundo abierto.",
    plataforma: "PC, Consola",
  },
  { id: 26, nombre: "FIFA 24", categoria: "Deportes", precio: 2300, img: "https://placehold.co/200x250/1E81CE/FFFFFF?text=FIFA+24", descripcion: "Simulador de fútbol con modos de juego realistas y Ultimate Team.", plataforma: "Todas las consolas"},
  {
    id: 27,
    nombre: "Animal Crossing: New Horizons",
    categoria: "Simulación / Social",
    precio: 2700,
    img: "https://placehold.co/200x250/F4D03F/333333?text=AC+NH",
    descripcion: "Crea tu paraíso en una isla desierta. Pesca, decora y socializa.",
    plataforma: "Nintendo Switch",
  },
  {
    id: 28,
    nombre: "Hades",
    categoria: "Acción / Roguelike",
    precio: 2000,
    img: "https://placehold.co/200x250/C0392B/FFFFFF?text=Hades",
    descripcion: "Juego roguelike de acción con una rica narrativa basada en la mitología griega.",
    plataforma: "PC, Consola, Switch",
  },
  {
    id: 29,
    nombre: "Gran Turismo 7",
    categoria: "Carreras / Simulación",
    precio: 2600,
    img: "https://placehold.co/200x250/3498DB/FFFFFF?text=GT+7",
    descripcion: "El simulador de carreras más completo para PlayStation, con cientos de coches.",
    plataforma: "PS5, PS4",
  },
  {
    id: 30,
    nombre: "Mario Kart 8 Deluxe",
    categoria: "Carreras / Familiar",
    precio: 2800,
    img: "https://placehold.co/200x250/1ABC9C/FFFFFF?text=MK8D",
    descripcion: "Diversión pura en carreras de karts con ítems y modos de batalla.",
    plataforma: "Nintendo Switch",
  },
  {
    id: 31,
    nombre: "The Witcher 3: Wild Hunt",
    categoria: "RPG / Aventura",
    precio: 4500,
    img: "https://placehold.co/200x250/F1C40F/333333?text=Witcher+3",
    descripcion: "Versión de colección y con gráficos mejorados para la nueva generación de consolas.",
    plataforma: "PS5, Xbox Series X/S, PC",
  },
  {
    id: 32,
    nombre: "Valorant",
    categoria: "Shooter / Táctico",
    precio: 0,
    img: "https://placehold.co/200x250/A93226/FFFFFF?text=Valorant",
    descripcion: "Shooter táctico 5v5 por equipos con habilidades de personajes únicos (Agentes).",
    plataforma: "PC (Gratis)",
  },
  {
    id: 33,
    nombre: "Overwatch 2",
    categoria: "Shooter / Héroes",
    precio: 0,
    img: "https://placehold.co/200x250/2C3E50/FFFFFF?text=OW+2",
    descripcion: "Juego de disparos en equipo gratuito, con nuevos héroes y el modo 5v5.",
    plataforma: "PC, Consola (Gratis)",
  },
  {
    id: 34,
    nombre: "Assassin’s Creed Valhalla",
    categoria: "Aventura / Acción",
    precio: 3400,
    img: "https://placehold.co/200x250/7D3C98/FFFFFF?text=AC+Valhalla",
    descripcion: "Encarna a un vikingo. Explora Inglaterra y libra batallas épicas contra reinos.",
    plataforma: "PC, PS5, Xbox Series X/S",
  },
  {
    id: 35,
    nombre: "Resident Evil 4 Remake",
    categoria: "Terror / Acción",
    precio: 3500,
    img: "https://placehold.co/200x250/E74C3C/FFFFFF?text=RE+4",
    descripcion: "Reimaginación del clásico de terror. Leon Kennedy rescata a la hija del presidente.",
    plataforma: "PC, PS5, Xbox Series X/S",
  },
  {
    id: 36,
    nombre: "The Sims 4",
    categoria: "Simulación / Social",
    precio: 2500,
    img: "https://placehold.co/200x250/505050/FFFFFF?text=The+Sims+4",
    descripcion: "Simulador de vida donde creas personajes y gestionas sus vidas, trabajos y casas.",
    plataforma: "PC, Consola",
  },
  {
    id: 37,
    nombre: "Dota 2",
    categoria: "MOBA / Estrategia",
    precio: 0,
    img: "https://placehold.co/200x250/1976D2/FFFFFF?text=Dota+2",
    descripcion: "MOBA complejo y competitivo. Lucha para destruir el Ancient enemigo en combates 5v5.",
    plataforma: "PC (Gratis)",
  },
  {
    id: 38,
    nombre: "Starfield",
    categoria: "Ciencia ficción / RPG",
    precio: 3600,
    img: "https://placehold.co/200x250/2C3E50/FFFFFF?text=Starfield",
    descripcion: "RPG de exploración espacial masivo del creador de Skyrim.",
    plataforma: "PC, Xbox Series X/S",
  },
  {
    id: 39,
    nombre: "Baldur’s Gate 3",
    categoria: "RPG / Fantasía",
    precio: 3700,
    img: "https://placehold.co/200x250/8E44AD/FFFFFF?text=BG+3",
    descripcion: "RPG con combate por turnos basado en Dragones y Mazmorras 5e. Historia ramificada.",
    plataforma: "PC, PS5",
  },
  {
    id: 40,
    nombre: "Terraria",
    categoria: "Aventura / Sandbox",
    precio: 1800,
    img: "https://placehold.co/200x250/1ABC9C/FFFFFF?text=Terraria",
    descripcion: "Aventura sandbox en 2D. Explora, construye, craftea y lucha contra jefes.",
    plataforma: "PC, Consola, Móvil",
  },
  {
    id: 41,
    nombre: "Left 4 Dead 2",
    categoria: "Cooperativo / Shooter",
    precio: 1600,
    img: "https://placehold.co/200x250/A93226/FFFFFF?text=L4D2",
    descripcion: "Shooter cooperativo de zombies para 4 jugadores. Supervive a hordas y enemigos especiales.",
    plataforma: "PC, Xbox 360",
  },
  {
    id: 42,
    nombre: "Rocket League",
    categoria: "Deportes / Autos",
    precio: 2100,
    img: "https://placehold.co/200x250/3498DB/FFFFFF?text=Rocket+League",
    descripcion: "Fútbol con coches propulsados por cohetes. Un juego rápido y muy competitivo.",
    plataforma: "PC, Consola",
  },
];

export function Games({ filteredGames = [], handleAddToCart }) {
  const lista = filteredGames.length > 0 ? filteredGames : games;

  // 🔹 ESTADO PARA EL POPUP ACTIVO (Guarda el ID del juego cuyo popover se debe mostrar)
  const [activePopoverId, setActivePopoverId] = useState(null);

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
          <li
            key={game.id}
            className="game-item"
            // Handlers para mostrar/ocultar el popover al pasar el ratón
            onMouseEnter={() => setActivePopoverId(game.id)}
            onMouseLeave={() => setActivePopoverId(null)}
          >
            {/* Imagen del juego */}
            <img
              // Usar placeholder si no hay URL de imagen definida
              src={
                game.img ||
                "https://via.placeholder.com/200x250/A9A9A9/FFFFFF?text=Sin+imagen" 
              }
              alt={game.nombre}
              // Fallback en caso de error de carga
              onError={(e) => {
                e.target.onerror = null; // Evita bucle infinito
                e.target.src = "https://via.placeholder.com/200x250/A9A9A9/FFFFFF?text=Error+Carga";
              }}
            />

            {/* Contenedor de información principal */}
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

            {/* 💡 CONTENEDOR DE INFORMACIÓN ESPECÍFICA (POPOVER) */}
            {activePopoverId === game.id && (
              <div className="popover active-popover">
                <p>
                  <strong>Plataforma:</strong> {game.plataforma || "No disponible"}
                </p>
                <p>
                  <strong>Descripción:</strong> {game.descripcion || "Descripción pendiente."}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* 🔹 Controles de paginación */}
      <div className="pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
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

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente ▶
        </button>
      </div>
    </div>
  );
}
