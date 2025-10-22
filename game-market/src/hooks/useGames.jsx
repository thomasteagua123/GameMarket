import { useState, useEffect } from "react";

const gamesData = [
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
  { id: 12, nombre: "The Legend of Zelda Breath of the Wild", categoria: "Aventura", precio: 3500, img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932259/The_Legend_of_Zelda_Breath_of_the_Wild-portada_gunk0g.jpg" },{ id: 13, nombre: "Grand Theft Auto V", categoria: "Acción / Mundo abierto", precio: 3500, img: "https://www.xtrafondos.com/wallpapers/los-santos-gta-v-5112.jpg" },
{ id: 14, nombre: "Spider-Man", categoria: "Aventura", precio: 3300, img: "./Spiderman.jpg" },
{ id: 15, nombre: "Cyberpunk 2077", categoria: "RPG / Acción", precio: 3200, img: "https://www.xtrafondos.com/wallpapers/cyberpunk-2077-5616.jpg" },
{ id: 16, nombre: "League of Legends", categoria: "MOBA / Estrategia", precio: 2500, img: "https://www.xtrafondos.com/wallpapers/league-of-legends-logo-5969.jpg" },
{ id: 17, nombre: "Valorant", categoria: "Shooter / Táctico", precio: 2200, img: "https://www.xtrafondos.com/wallpapers/personajes-de-valorant-5692.jpg" },
{ id: 18, nombre: "Counter Strike: Global Offensive", categoria: "Shooter", precio: 2100, img: "https://www.xtrafondos.com/wallpapers/counter-strike-global-offensive-csgo-6055.jpg" },
{ id: 19, nombre: "Red Dead Redemption 2", categoria: "Aventura / Acción", precio: 3500, img: "https://www.xtrafondos.com/wallpapers/atardecer-paseo-en-caballo-red-dead-redemption-2-5735.jpg" },
{ id: 20, nombre: "Pokémon GO", categoria: "Aventura / AR", precio: 1500, img: "https://www.xtrafondos.com/wallpapers/pokemon-go-aventura-4700.jpg" },
{ id: 21, nombre: "Fortnite", categoria: "Battle Royale", precio: 1900, img: "https://www.xtrafondos.com/wallpapers/fortnite-x-avengers-stormbreaker-5256.jpg" },
{ id: 22, nombre: "Super Smash Bros Ultimate", categoria: "Lucha / Party", precio: 3200, img: "https://www.xtrafondos.com/wallpapers/super-smash-bros-ultimate-4482.jpg"},
{ id: 23, nombre: "Just Dance 2024", categoria: "Baile", precio: 2000, img: "https://www.xtrafondos.com/wallpapers/just-dance-2021-5950.jpg"},
{ id: 24, nombre: "Diablo IV", categoria: "RPG / Acción", precio: 3400, img: "https://www.xtrafondos.com/wallpapers/diablo-iv-logo-4225.jpg"},
{ id: 25, nombre: "The Witcher 3: Wild Hunt", categoria: "Aventura / RPG", precio: 3300, img: "https://www.xtrafondos.com/wallpapers/the-witcher-3-wild-hunt-2913.jpg" },
{ id: 26, nombre: "FIFA 24", categoria: "Deportes", precio: 2300, img: "https://www.xtrafondos.com/wallpapers/ea-sports-fc24-8927.jpg" },
{ id: 27, nombre: "Animal Crossing: New Horizons", categoria: "Simulación / Social", precio: 2700, img: "https://www.xtrafondos.com/wallpapers/animal-crossing-new-horizons-4951.jpg" },
{ id: 28, nombre: "Hades", categoria: "Acción / Roguelike", precio: 2000, img: "https://www.xtrafondos.com/wallpapers/hades-6245.jpg" },
{ id: 29, nombre: "Gran Turismo 7", categoria: "Carreras / Simulación", precio: 2600, img: "https://www.xtrafondos.com/wallpapers/gran-turismo-7-7245.jpg" },
{ id: 30, nombre: "Mario Kart 8 Deluxe", categoria: "Carreras / Familiar", precio: 2800, img: "https://www.xtrafondos.com/wallpapers/mario-kart-8-deluxe-5481.jpg" }

];

export function useGames() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Aquí simulamos fetch o carga de datos
    setGames(gamesData);
  }, []);

  return games;
}
