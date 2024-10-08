const x: number = 1;
console.log(x);


function greet(firstName: string) {
  console.log("Hello " + firstName);
}
greet("Vishal");


function sum(a: number, b: number): number { //good practise to explicitly mention 'type' of return value
  return a + b;
}
console.log(sum(2, 3));
//type inference ~ typescript still knows/understand implicitly what is the type of the return ~ TypeScript's type inference automatically determines the return type of the sum function as number, even though you didn't explicitly specify it.
//so just writing this without mentioning 'type' of return value also works
// function sum(a: number, b: number) {
//   return a + b;
// }
// console.log(sum(2, 3));


function isLegal(age: number) {
  if (age > 18) {
    return true;
  } else {
    return false;
  }
}
//let y = isLegal(2);
console.log(isLegal(2));


function runAfter1S(fn: () => void) {
  setTimeout(fn, 1000);
}
runAfter1S(function () {
  console.log("hi there");
})


//Interfaces
interface User {
  firstName: String,
  lastName: String,
  email: String,
  age: number,
  gender?: String  //optional argument ~ user can/cannot provide this, its his wish it still works in both the cases nontheless
}

function isLegal2(user: User) {
  //console.log(user);
  if (user.age > 18) {
    return true;
  }
  else {
    return false;
  }
}

function greetUser(user: User) {
  console.log("Namaste " + user.firstName);
}

const ans = isLegal2({
  firstName: "vishal",
  lastName: "singh",
  email: "madhava@gmail.com",
  age: 29
})
console.log(ans);

// Create a React component that takes todos as an input and renders them
// Todo.tsx
// interface TodoProps {
//   title: string;
//   description: string;
// }

// function Todo(props: TodoProps) {
//   return (
//     <div>
//       <h1>{props.title}</h1>
//       <p>{props.description}</p>
//     </div>
//   );
// }

// App.tsx
// function App() {
//   return (
//     <div>
//       <h1>Todo List</h1>
//       <Todo title="Konkani" description="Language" />
//       <Todo title="Learn TypeScript" description="For React development" />
//     </div>
//   );
// }


//Implementing interfaces
// Define the Person interface
interface Person {
  name: string;
  age: number;
  greet(phrase: string): void;
}

// Create a class Employee that implements Person
class Employee implements Person {
  name: string;
  age: number;

  constructor(name2: string, age2: number) {
    this.name = name2;
    this.age = age2;
  }

  greet(phrase: string) {
    console.log(`${phrase} ${this.name}`);
  }
}

// Create two employees, Bittu and Monu
let employee_1 = new Employee('Bittu', 30);
let employee_2 = new Employee('Monu', 25);

// Use the greet method
employee_1.greet('Hello');  // Output: Hello Bittu
employee_2.greet('Hi');      // Output: Hi Monu

// Access employee properties
console.log(employee_1.name, employee_1.age);  // Output: Bittu 30
console.log(employee_2.name, employee_2.age);    // Output: Monu 25


//Types
//almost same as interfaces,but types gives us few extra features ~ there are some case where you can only use types then you should use types otherwise in most cases you just use interfaces this is the standard practice of what to use between interfaces and types when given a choice
type User3 = {
	firstName: string;
	lastName: string;
	age: number
}

//1
type Greet_arg = number | string; //types let us define multiple types together, interfaces don't allow this

function greet3(id: Greet_arg){
//function greet3(id: number | string){
}
greet3(3);
greet('3');


//2
//create a type that has every property of multiple types/ interfaces
type Employee3 = {
  name: string;
  startDate: Date;
};

type Manager = {
  name: string;
  department: string;
};

type TeamLead = Employee3 & Manager;

const teamLead: TeamLead = {
  name: "vishal",
  startDate: new Date(),
  department: "Web3 developer"
};


//Arrays
// type chomu = number[];
//1
function maxValue(arr: number[]) {
  // function maxValue(arr: chomu) {
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
      if (arr[i] > max) {
          max = arr[i]
      }
  }
  return max;
}
console.log(maxValue([1, 2, 3]));


//2
interface User2 {
	firstName: string;
	lastName: string;
	age: number;
}
function filteredUsers(users: User2[]) {
    return users.filter(x => x.age >= 18);
}
console.log(filteredUsers([{
    firstName: "harkirat",
    lastName: "Singh",
    age: 21
}, {
    firstName: "Raman",
    lastName: "Singh",
    age: 16
}, ]));


/*
Differences Between Interface and Type:
Interfaces are more suited for defining the structure of an object and can be extended or merged.
Types are more flexible and can represent more complex scenarios beyond just object structures.
Types cannot be re-opened to add new properties, while interfaces can be extended.

When to Use Each:
Use interfaces when you need to define the shape of an object and expect that shape to be extended or used in various parts of your application.
Use types when you need more flexibility or when you're dealing with unions, intersections, or other advanced type manipulations.
*/