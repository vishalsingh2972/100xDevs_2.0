"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generated_1 = require("./generated");
async function main() {
    const response = await generated_1.DefaultService.getUser("44444444");
    const fetching_way = await fetch("http://127.0.0.1:8787/user/111111");
    const response2 = await fetching_way.json();
    console.log(response);
    console.log(response2);
}
main();
