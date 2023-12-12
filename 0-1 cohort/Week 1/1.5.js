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
    cb(data);
  });
}
function onDone(data) {
  console.log(data);
}
kiratsReadFile(onDone);

//Cleaner way (by using Promises) //there are no callbacks when we use Promise as the reason to introduce promise is to get rid of callbacks because callbacks are an ugly way to write asynchronous code
const fs = require('fs');
// my own asynchronous function
function kiratsReadFile() {
  return new Promise(function(resolve) {
    fs.readFile("a.txt", "utf-8", function(err, data) {
      resolve(data);
    });
  })
}
// callback function to call
function onDone(data) {
  console.log(data)
}
kiratsReadFile().then(onDone);