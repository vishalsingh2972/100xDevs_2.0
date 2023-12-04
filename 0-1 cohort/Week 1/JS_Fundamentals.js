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
console.log(user1[gender]);

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
 
//calculateArithmatic wala example



function sum(num1, num2, fnToCall) {
  let result = num1 + num2;
  //return result;
  fnToCall(result);
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


