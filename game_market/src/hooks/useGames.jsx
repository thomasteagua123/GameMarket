import { useState, useEffect } from "react";
import { games } from "../lib/mocks";


export function useGames() {

  const [allGames, setAllGames] = useState(games || []);

  return allGames;
}
