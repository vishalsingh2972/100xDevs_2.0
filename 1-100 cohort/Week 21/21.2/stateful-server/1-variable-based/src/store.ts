interface Game {
  id: string;
  whitePlayer: string;
  blackPlayer: string;
  moves: string[];
}

export const games: Game[] = [];

//export const games: any[] = [];