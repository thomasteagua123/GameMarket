import { useState, useEffect } from "react";

const games = [
  {
    id: 1,
    nombre: "Among Us",
    categoria: "Party",
    precio: 2200,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932257/Among_Us_portada_h8wqlp.jpg",
    information:
      "Among Us es un juego de multijugador / party game / deductivo con un precio de 9.99.",
  },
  {
    id: 2,
    nombre: "Call of Duty Modern Warfare II",
    categoria: "Shooter",
    precio: 2300,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932264/Call_of_Duty_Modern_Warfare_II_portada_uacnzo.jpg",
    information:
      "Call of Duty: Modern Warfare II es un juego de shooter en primera persona (fps) con un precio de 19.99.",
  },
  {
    id: 3,
    nombre: "EA FC24",
    categoria: "Deportes",
    precio: 2300,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932258/EA_FC24_portada_wotsla.jpg",
    information:
      "FIFA 24 es un juego de deportes / fútbol con un precio de 6.99.",
  },
  {
    id: 4,
    nombre: "Elden Ring",
    categoria: "RPG",
    precio: 2300,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932257/Elden_Ring_portada_bcmnj7.jpg",
    information:
      "Elden Ring es un juego de rpg de acción / mundo abierto con un precio de 42.99.",
  },
  {
    id: 5,
    nombre: "God of War III",
    categoria: "Acción",
    precio: 2100,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932257/God_of_War_III_portada_k6tdji.jpg",
    information:
      "God of War es un juego de acción y aventura con un precio de 79.99.",
  },
  {
    id: 6,
    nombre: "Hollow Knight",
    categoria: "Aventura",
    precio: 2100,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932258/Hollow_Knight_portada_xrpypv.png",
    information:
      "Hollow knight es un juego de metroidvania / plataformas de acción con un precio de 79.99.",
  },
  {
    id: 7,
    nombre: "Hollow Knight Silksong first",
    categoria: "Aventura",
    precio: 2100,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932258/Hollow_Knight_Silksong_first_portada_yrp6wt.jpg",
    information:
      "Hollow Knight: Silksong es un juego de acción/ aventura/ metroidvania con un precio de 7.00.",
  },
  {
    id: 8,
    nombre: "Logo of Stardew Valley",
    categoria: "Estrategia",
    precio: 2100,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932259/Logo_of_Stardew_Valley_ixk9lq.png",
    information:
      "Stardew Valley es un juego de simulación / agricultura / rpg con un precio de 21.99.",
  },
  {
    id: 9,
    nombre: "Minecraft",
    categoria: "Sandbox",
    precio: 1800,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932259/Minecraft_portada_mh8eho.png",
    information: "Minecraft es un juego de aventura con un precio de 5.00.",
  },
  {
    id: 10,
    nombre: "Mortal Kombat 1",
    categoria: "Lucha",
    precio: 1800,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932259/Mortal_Kombat_1_portada_qp4dnq.jpg",
    information: "Mortal Kombat es un juego de lucha con un precio de 35.97.",
  },
  {
    id: 11,
    nombre: "Party Hard",
    categoria: "Indie",
    precio: 1800,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932259/Party_Hard-portada_ws3kfp.jpg",
    information:
      "Party Hard es un juego de acción y sigilo con un precio de 9.99.",
  },
  {
    id: 12,
    nombre: "The Legend of Zelda Breath of the Wild",
    categoria: "Aventura",
    precio: 3500,
    img: "https://res.cloudinary.com/dlttzxwmj/image/upload/v1759932259/The_Legend_of_Zelda_Breath_of_the_Wild-portada_gunk0g.jpg",
    information:
      "The Legend of Zelda: Breath of the Wild es un juego de aventura / mundo abierto con un precio de 7.00.",
  },
  {
    id: 13,
    nombre: "Grand Theft Auto VI",
    categoria: "Acción / Mundo abierto",
    precio: 3500,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1759942464/Grand_Theft_Auto_VI_skukmu.png",
    information:
      "GTA VI es un juego de acción / mundo abierto con un precio de 114.59.",
  },
  {
    id: 14,
    nombre: "Spider-Man",
    categoria: "Aventura",
    precio: 3300,
    img: "./Spiderman.jpg",
    information:
      "Spider-Man es un juego de aventura basado en el famoso superhéroe con acción y exploración.",
  },
  {
    id: 15,
    nombre: "Cyberpunk 2077",
    categoria: "RPG / Acción",
    precio: 3200,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1759944675/Cyberpunk_2077_box_art_ogdpec.jpg",
    information:
      "Cyberpunk 2077 es un juego de rpg de acción / futurista con un precio de 41.47.",
  },
  {
    id: 16,
    nombre: "League of Legends",
    categoria: "MOBA / Estrategia",
    precio: 2500,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1761230244/leagueoflegends_ahwadl.jpg",
    information:
      "League of Legends es un juego multijugador de arena de batalla en línea con estrategia en tiempo real.",
  },
  {
    id: 17,
    nombre: "Valorant",
    categoria: "Shooter / Táctico",
    precio: 2200,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1761230173/valo_w6rhbn.jpg",
    information:
      "Valorant es un shooter táctico multijugador con habilidades únicas para cada personaje.",
  },
  {
    id: 18,
    nombre: "Counter Strike: Global Offensive",
    categoria: "Shooter",
    precio: 2100,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1761230119/cs_iudcd1.jpg",
    information:
      "CS:GO es un shooter en primera persona con partidas competitivas y modos cooperativos.",
  },
  {
    id: 19,
    nombre: "Red Dead Redemption 2",
    categoria: "Aventura / Acción",
    precio: 3500,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1761230039/reddead_yy4qy7.jpg",
    information:
      "Red Dead Redemption 2 es un juego de aventura en mundo abierto ambientado en el Viejo Oeste.",
  },
  {
    id: 20,
    nombre: "Pokémon GO",
    categoria: "Aventura / AR",
    precio: 1500,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1761229948/Pokemon_Go_iddxdj.jpg",
    information:
      "Pokémon GO es un juego móvil de realidad aumentada para capturar criaturas en el mundo real.",
  },
  {
    id: 21,
    nombre: "Fortnite",
    categoria: "Battle Royale",
    precio: 1900,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1761229855/fortnite_xas0ps.jpg",
    information:
      "Fortnite es un juego Battle Royale con construcción y combate en línea masivo.",
  },
  {
    id: 22,
    nombre: "Super Smash Bros Ultimate",
    categoria: "Lucha / Party",
    precio: 3200,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1759944667/Super_Smash_Bros._Ultimate_t2gxkw.jpg",
    information:
      "Super Smash Bros Ultimate es un juego de lucha / party con un precio de 98.67.",
  },
  {
    id: 23,
    nombre: "Just Dance 2024",
    categoria: "Baile",
    precio: 2000,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1759944679/Just_Dance_2024_Edition_fwbeju.jpg",
    information:
      "Just Dance 2024 es un juego de música / baile con un precio de 49.01.",
  },
  {
    id: 24,
    nombre: "Diablo IV",
    categoria: "RPG / Acción",
    precio: 3400,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1761229705/diablo_kunxyk.jpg",
    information:
      "Diablo IV es un juego de rol de acción con ambientes oscuros y combates intensos.",
  },
  {
    id: 25,
    nombre: "The Witcher 3: Wild Hunt",
    categoria: "Aventura / RPG",
    precio: 3300,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1761229627/Thewitcher3_gzh3zw.jpg",
    information:
      "The Witcher 3 es un RPG de mundo abierto con una historia profunda y exploración.",
  },
  {
    id: 26,
    nombre: "FIFA 24",
    categoria: "Deportes",
    precio: 2300,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1761229470/Fifa24_wpbc5x.jpg",
    information:
      "FIFA 24 es un juego de deportes / fútbol con un precio de 6.99.",
  },
  {
    id: 27,
    nombre: "Animal Crossing: New Horizons",
    categoria: "Simulación / Social",
    precio: 2700,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1759944672/Animal_Crossing_New_Horizons_mf0hin.jpg",
    information:
      "Animal Crossing: New Horizons es un juego de simulación / social con un precio de 64.91.",
  },
  {
    id: 28,
    nombre: "Hades",
    categoria: "Acción / Roguelike",
    precio: 2000,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1759944674/Hades_cover_art_askbqj.jpg",
    information:
      "Hades es un juego de acción / roguelike con un precio de 28.17.",
  },
  {
    id: 29,
    nombre: "Gran Turismo 7",
    categoria: "Carreras / Simulación",
    precio: 2600,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1759944671/Gran_Turismo_7_cover_art_n617nd.jpg",
    information:
      "Gran Turismo 7 es un juego de carreras / simulación con un precio de 84.37.",
  },
  {
    id: 30,
    nombre: "Mario Kart 8 Deluxe",
    categoria: "Carreras / Familiar",
    precio: 2800,
    img: "https://res.cloudinary.com/dupxcqrzt/image/upload/v1759944670/MarioKart8Boxart_jlyfco.jpg",
    information:
      "Mario Kart 8 Deluxe es un juego de carreras / familiar con un precio de 70.14.",
  },
];

export function useGames() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Aquí simulamos fetch o carga de datos
    setGames(games);
  }, []);

  return games;
}
