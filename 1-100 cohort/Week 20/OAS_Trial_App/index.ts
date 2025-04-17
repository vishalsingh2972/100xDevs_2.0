import { DefaultService } from "./generated";

async function main() {
const response = await DefaultService.getUser("123456789");
console.log(response);
}

main();