//ENUMS
type keyInput = "up" | "down" | "left" | "right";

function doSomething(keyPressed: keyInput) {
  // do something
  // console.log(keyPressed);
  // console.log('did something');
}
doSomething("up");
// doSomething("upi"); //compilation error

//better way ~ more human readable
enum Direction {
  Up, //0
  Down, //1
  Left, //2
  Right //3
}
function doSomething2(keyPressed: Direction) {
  // do something
  // console.log(keyPressed);
  // console.log('did something');
}
doSomething2(Direction.Up);
// console.log(Direction.Up); //0
// console.log(typeof(Direction.Up)); //number


enum Direction2 {
  Up = "up", 
  Down = "down", 
  Left = "left", 
  Right = "right"
}
function doSomething3(keyPressed: Direction2) {
  // do something
  // console.log(keyPressed);
  // console.log('did something');
}
doSomething3(Direction2.Up);
// console.log(Direction2.Up); //"up"
// console.log(typeof(Direction2.Up)); //string


enum Direction3 {
  Up = 1, 
  Down = "down", 
  Left = "left", 
  Right = "right"
}
function doSomething4(keyPressed: Direction3) {
  // do something
  // console.log(keyPressed);
  // console.log('did something');
}
doSomething4(Direction3.Up);
// console.log(Direction3.Up); //1
// console.log(typeof(Direction3.Up)); //number
// console.log(Direction3.Down); //"down"
// console.log(typeof(Direction3.Down)); //string


enum Dir {
  Up = 11,  //Up = 1,
  Down, 
  Left, 
  Right
}
function DS(keyPressed: Dir) {
  // do something
  console.log(keyPressed);
  console.log('did something');
}
DS(Dir.Up);
console.log(Dir.Up); //11
console.log(typeof(Dir.Up)); //number
console.log(Dir.Down); //12
console.log(typeof(Dir.Down)); //number


//Common usecase in express
// const app = express();
// enum ResponseStatus {
//   Success = 200,
//   NotFound = 404,
//   Error = 500
// }

// app.get("/", (req, res) => {
//   if (!req.query.userId) {
//     res.status(ResponseStatus.Error).json({})
//   }
//   // and so on...
//   res.status(ResponseStatus.Success).json({});
// })

//----------------------------------------------------------------------------------------------------------------------------------------

//GENERICS
type Input = number | string; //type Input2 = number[] | string[];
function firstElement(arr: Input[]){
  return arr[0];
}
const value = firstElement(["vishal","singh", 3]); //can send different types of values in inputs, without any type errors ~ this is a problem
// console.log(value.toUpperCase()); //error as toUpperCase cannot be done in case if Input is number
// console.log(value.toString().toUpperCase()); //will work
// if (typeof value === 'string') { //will work
//   console.log(value.toUpperCase());
// }


function identity<T>(arg: T): T {
  return arg;
}
let output1 = identity<string>("myString");
let output2 = identity<number>(100);
console.log(output1.toUpperCase());


function getFirstElement<T>(arr: T[]): T { //function getFirstElement2<T>(arr: T[]) { even this works
  return arr[0];
}
const el = getFirstElement<string>(["vishalSingh", "ramanSingh"]); //const el = getFirstElement(["vishalSingh", "ramanSingh"]); even this works
const el2 = getFirstElement<number>([1, 2]);
const el3 = getFirstElement<string | number>(["vishalSingh", "ramanSingh", 3, 4]); //const el3 = getFirstElement(["vishalSingh", "ramanSingh", 3, 4]);

interface User {
  name: String
}
const el4 = getFirstElement<User>([{name:"Vishal Singh"}]);
console.log(el.toLowerCase());
console.log(el4);
console.log(el4.name);

//Imports and Exports