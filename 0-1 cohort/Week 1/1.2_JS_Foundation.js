var a = 1;
a = 2;
console.log(a);

let a2 = 1;
a2 = 2;
console.log(a);

const a3 = 1;
//a3 = 2; //error
//console.log(a);

//

let firstName = "vishal";
let age = 20;
let isMarried= false;

console.log("This person's name is " + firstName + " and their age is " + age);

//

if(isMarried == true){
  console.log(firstName + " is married.");
}
else{
  console.log(firstName + " is not married.");
}

//

let answer = 0;

for(let i = 0; i<=1000; i++){
  answer++;
}

console.log(answer);

//Complex Primitives -  Arrays and Objects
/// Arrays
const ages = [21, 22, 23, 24, 25];
const numberOfPeople = ages.length;
for(let i = 0; i<numberOfPeople; i++){
  if(ages[i] % 2 == 0){ 
    console.log(ages[i]);
  }
}

const personArray = ["ram", "sita", "laxman", "hanuman"];
const genderArray = ["male", "female", "male", "male",];
const numberOfUsers = personArray.length;
  // loop through and print all male / female names
for(let i = 0; i<numberOfUsers; i++){
      if (genderArray[i] == "male") {
         console.log(personArray[i]);
      }
  }

///Objects
const user1 = {
  firstName: "Shiva",
  gender: "male"
};
console.log(user1["gender"]);

const user2 = [{ //array named user2 containing a single object as its element
  firstName: "Shiva",
  gender: "male"
}];
console.log(user2[0]["gender"]);

//array of objects at each index
const allUsers = [{ 
  firstName: "Vishal",
  gender: "male"
},{
  firstName: "Krishna",
  gender: "male"
},{
  firstName: "Radha",
  gender: "female"
}]
for(let i = 0; i<allUsers.length; i++){
  if(allUsers[i]["gender"]=="male"){
    console.log(allUsers[i]["firstName"]);
  }
}

const allUsers2 = [{ // array named allUsers2 containing 3 objects as its elements, each of these objects is further nested, meaning object inside object.
  firstName: "Vishal",
  gender: "male",
  metadata:{
    age: "1",
    role: "Bhakti"
}
},{
  firstName: "Krishna",
  gender: "male",
  metadata:{
      age: "10",
      role: "Shaktimaan"
  }
},{
  firstName: "Radha",
  gender: "female",
  metadata:{
    age: "12",
    role: "Shakti"
}
}]
for(let i = 0; i<allUsers2.length; i++){
  if(allUsers2[i]["metadata"]["role"]=="Shaktimaan"){
    console.log(allUsers2[i]["firstName"]);
  }
}

//Functions
function sum(a, b){
// do things with the input and return an output
  const sumValue = a + b;
  return sumValue;
}
const value = sum(1,2);
const value2 = sum(1,10);
console.log(value);


// Callbacks - passing a whole function as an argument
 
function sum(num1, num2, fnToCall) {
  let result = num1 + num2;
  //return result;
  fnToCall(result);
  //console.log('Bittu');
}
function displayResult(data) {
  console.log("Result of the sum is : " + data);
}
function displayResultPassive(data) {
  console.log("Sum's result is : " + data);
}
// You are only allowed to call one function after this
// How will you displayResult of a sum
const ans = sum(1, 2, displayResult);
//const ans = sum(1, 2, displayResultPassive);


function calculateArithemetic(a, b, type){ // NO callback
    if(type == "sum"){
      const value = sum(a, b);
      return value;
    }
    if(type == "minus"){
      const value = sub(a, b);
      return value;
    }
}
function sum(a, b){
   return a + b;
}
function sub(a, b){
  return a - b;
}
const VALUE = calculateArithemetic(1, 2, "minus");
console.log(VALUE);


function calculateArithemetic2(a, b, arithematicFinalFunction){ //callback is happening in this as function passed as an argument to another function.
  const ans = arithematicFinalFunction(a, b);
  return ans;
}
function sum(a, b){
 return a + b;
}
function sub(a, b){
return a - b;
}
const VALUE2 = calculateArithemetic2(1, 2, sum); //here sum function acts as a callback function as this function is being passed as an argument to another function.
console.log(VALUE2);
//const VALUE3 = calculateArithemetic2(1, 2, sub); 

function square(n){
  return n * n;
}
function cube(n){
  return n * n * n;
}
function SUM(a,b,callbackFn){
 //console.log(callbackFn);  
 const val1 = callbackFn(a);
 const val2 = callbackFn(b);
 return val1 + val2;
}
console.log(SUM(2,2,square));  
console.log(SUM(2,2,cube));  


//setTimeout //setInterval
function greet(){
  console.log("Namaste");
}
setTimeout(greet, 5000); //5 sec
setInterval(greet, 1000); 

function hello(parameter1, parameter2){
  console.log(parameter1,parameter2);
}
setTimeout(hello, 2000, 'Radhe', "Shyam");

// Bounty ($25)
function calculateArithemetic3(a, b, arithematicFinalFunction){ 
  const ans = arithematicFinalFunction(a, b);
  return ans;
}
function sum3(a, b){
 return a + b;
}
function sub3(a, b){
return a - b;
}
function displayResult3(data) {
  console.log("Result of the sum is : " + data);
  return data; //this was missing hence was getting undefined error
} 
console.log("bittu " + displayResult3(sum3(1,2)));


