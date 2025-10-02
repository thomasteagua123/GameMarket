import React from "react";
import "./games.css"; 

const games = [
  { id: 1, nombre: "Among Us", categoria: "Party", precio: 2200, img: "/images/Among_Us_portada.jpg" },
  { id: 2, nombre: "Call of Duty Modern Warfare II", categoria: "Shooter", precio: 2300, img: "/images/Call_of_Duty_Modern_Warfare_II_portada.jpg" },
  { id: 3, nombre: "EA FC24", categoria: "Deportes", precio: 2300, img: "/images/EA_FC24_portada.jpg" },
  { id: 4, nombre: "Elden Ring", categoria: "RPG", precio: 2300, img: "/images/Elden_Ring_portada.jpg" },
  { id: 5, nombre: "God of War III", categoria: "Acción", precio: 2100, img: "/images/God_of_War_III_portada.jpg" },
  { id: 6, nombre: "Hollow Knight", categoria: "Aventura", precio: 2100, img: "/images/Hollow_Knight_portada.png" },
  { id: 7, nombre: "Hollow Knight Silksong first", categoria: "Aventura", precio: 2100, img: "/images/Hollow_Knight_Silksong_first_portada.jpg" },
  { id: 8, nombre: "Logo of Stardew Valley", categoria: "Estrategia", precio: 2100, img: "/images/Logo_of_Stardew_Valley.png" },
  { id: 9, nombre: "Minecraft", categoria: "Sandbox", precio: 1800, img: "/images/Minecraft_portada.png" },
  { id: 10, nombre: "Mortal Kombat 1", categoria: "Lucha", precio: 1800, img: "/images/Mortal_Kombat_1_portada.jpeg" },
  { id: 11, nombre: "Party Hard", categoria: "Indie", precio: 1800, img: "/images/Party_Hard_portada.jpg" },
  { id: 12, nombre: "The Legend of Zelda Breath of the Wild", categoria: "Aventura", precio: 3500, img: "/images/The_Legend_of_Zelda_Breath_of_the_Wild_portada.jpg" },
];


export function Games() {
  // const [cartItems, setCartItems] = useState([]);
  // const handleAddToCart = (game) => {
  //     let updatedCart;
  
  //     const existingItem = cartItems.find(
  //       (item) => item.game_id === game.game_id
  //     );
  
  //     if (existingItem) {
  //       updatedCart = cartItems.map((item) =>
  //         item.game_id === game.game_id
  //           ? { ...item, cantidad: item.cantidad + 1 }
  //           : item
  //       );
  //     } else {
  //       updatedCart = [
  //         ...cartItems,
  //         {
  //           game_id: game.game_id,
  //           nombre: game.name,
  //           precio: game.price,
  //           cantidad: 1,
  //         },
  //       ];
  //     }
  
  //     sessionStorage.setItem("carrito", JSON.stringify(updatedCart));
  //     setCartItems(updatedCart);
  //     setCartCount(updatedCart.reduce((sum, item) => sum + item.cantidad, 0));
  return (
    <div>
      <h1>Lista de Juegos</h1>
      <ul className="games-grid">
        {games.map((game) => (
          <li key={game.id}>
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
