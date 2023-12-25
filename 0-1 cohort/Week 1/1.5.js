//Asynchronous example
// function findSum(n) {
//   let ans = 0;
//   for (let i = 0; i<n; i++) {
//     ans += i;
//   }
//   return ans;
// }
// function findSumTill100() {
//   console.log(findSum(100));
// }
// setTimeout(findSumTill100, 1000); //asynchronous setTimeout function
// console.log("hello world");

//Synchronous example
// function findSum(n) {
//   let ans = 0;
//   for (let i = 0; i<n; i++) {
//     ans += i;
//   }
//   return ans;
// }
// function findSumTill100() {
//   console.log(findSum(100));
// }
// function syncSleep(){
//   let a = 1;
//   for(let i = 0; i<1000000; i++){
//     a++;
//   }
//   console.log("sync sleep over");
// }
// syncSleep();
// findSumTill100();
// console.log("hello world");

//Common ASYNC Functions -  setTimeout(), fs.readFile, Fetch

//fs.readFile - an async process to read a file in your file system
const fs = require("fs"); //here fs = filesystem, a nodejs library that helps us with things like reading from a file, writing to a file etc.
                          //so now fs gives us access to a function called readFile
fs.readFile("a.txt","utf-8", function(err, data){
  console.log(data); //will run second as fs.readFile is async
});
console.log('Amigo'); //will run first


const fs = require("fs"); 
fs.readFile("a.txt","utf-8", function(err, data){
  console.log(data); 
});
console.log('Amigo');
let a = 0;
//takes very long, longer than the file read function above but still it will go to read function only after finishing below code
for(let i = 0; i<100000000; i++){
  a+=i;
}
console.log('Amigo2');
// Output:
// Amigo
// Amigo2
// Amigo inside a.txt


//Loupe example (ran in http://latentflip.com/loupe and understood via visualisation the working of Call Stack, Web Apis, Callback Queue and Event Loop🔄)
//Ex 1
console.log("Hi!");

setTimeout(function(){
    console.log("from inside async function");
}, 20000);

let a = 0;
for(let i = 0; i<10; i++){
    a++;
}
console.log(a);

//Ex 2
console.log("Hi!");

setTimeout(function(){
    console.log("kamla bai 1");
}, 20000);

setTimeout(function(){
    console.log("kamla bai 2");
}, 10000);

let a = 0;
for(let i = 0; i<10; i++){
    a++;
}
console.log(a);

//Ex 3
console.log("Hi!");

setTimeout(function one(){
    console.log("kamla bai 1");
}, 20000);

setTimeout(function two(){
    console.log("kamla bai 2");
}, 10000);

let a = 0;
for(let i = 0; i<10; i++){
    a++;
}
console.log(a);


//Promises

//Ugly way to create async functions of our own (without using Promises)
const fs = require('fs');
// my own asynchronous function
function kiratsReadFile(cb) {
  fs.readFile("a.txt", "utf-8", function(err, data) {
    //console.log('second');
    cb(data);
  });
}
function onDone(data) {
  console.log(data);
}
kiratsReadFile(onDone);
//console.log('first');

//Cleaner way (by using Promises) //there are no callbacks when we use Promise as the reason to introduce promise is to get rid of callbacks because callbacks are an ugly way to write asynchronous code
const fs = require('fs');
// my own asynchronous function
function kiratsReadFile() {
  // console.log('inside kiratReadFile function before Promise');
  return new Promise(function(resolve) {
    // console.log('inside promise before readFile');
    fs.readFile("a.txt", "utf-8", function(err, data) {
      // console.log('before resolve');
      resolve(data); //try - resolve(data+1); or resolve(data+' 1');
      // console.log('after resolve');
    });
  })
}
// callback function to call
function onDone(Data) {
  // console.log('before Data');
  console.log(Data);
  //console.log(Data + ' 1998');
}
kiratsReadFile().then(onDone);
// console.log('last');


//Way to initialize a Promise
var a1 = new Promise();//❌
var a2 = new Promise(function());//❌
var a3 = new Promise(function(resolve){});//✅
var a4 = new Promise(function(Fighter){});//✅


//Promise at a high level can have 3 states - pending, resolved and rejected
var d =  new Promise(function(resolve) {
  setTimeout(function(){
    //console.log('data added');
    resolve('bittu');
  },2000);
});

function callback(){
  console.log(d);//promise is in resolved state by this point of time
}

//console.log('no data');
console.log(d); //value empty as resolve in Promise is still in progress (will take 2 sec) //promise is still in pending state at this point of time
d.then(callback);


//Example of Promise that immediately resolves
let P = new Promise(function(resolve){
  //console.log('before');
  resolve('Hanuman'); //this marks the point where the async operation (represented by the Promise) is considered complete, and the resolved value/data "Hanuman" is passed to the .then() method
  //console.log('after')
});

P.then(function(){ //.then gets called whenever the async function resolves
  console.log(P);
});
//or can write function outside then separately like this as well
// function extra(){
//   console.log(P);
// }
// P.then(extra);


//Example 2 (get value stored in resolve in output)
let P2 = new Promise(function(resolve){
  resolve('Hanuman');
});

function extra2(value){
  console.log(value);
}

P2.then(extra);
//or can also write directly as 
// P2.then(function(value){
//   console.log(value);
// });



