import { GameManager } from "./store";
import { startLogger } from "./logger";

startLogger();
const gameManager = new GameManager();

setInterval(() => {
    gameManager.addGame(Math.random().toString())
}, 5000)