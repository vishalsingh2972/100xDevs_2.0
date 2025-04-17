import { DefaultService } from "./generated";

async function main() {
const response = await DefaultService.getUser("123");
console.log(response);
}

main();