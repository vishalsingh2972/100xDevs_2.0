//Constant exports and imports
import { add } from "./math"

console.log(add(1, 2));

//Default exports and imports
import Calculator from './math';

const calc = new Calculator();
console.log(calc.add(10, 5));