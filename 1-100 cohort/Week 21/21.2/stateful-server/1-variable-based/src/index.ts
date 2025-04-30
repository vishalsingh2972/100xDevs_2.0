import { games } from "./store";
import { startLogger } from "./logger";

startLogger();

setInterval(() => {
    games.push({
        id: Math.random().toString(),
        whitePlayer: "Vishal",
        blackPlayer: "Thomas",
        moves: []
    })
}, 5000)