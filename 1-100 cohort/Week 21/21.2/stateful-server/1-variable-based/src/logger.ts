import { games } from "./store";

export function startLogger() {
    setInterval(() => {
        console.log(games);
    }, 5000)
}