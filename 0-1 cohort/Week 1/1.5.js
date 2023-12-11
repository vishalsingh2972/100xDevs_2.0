//Asynchronous example
function findSum(n) {
  let ans = 0;
  for (let i = 0; i<n; i++) {
    ans += i;
  }
  return ans;
}

function findSumTill100() {
  console.log(findSum(100));
}

setTimeout(findSumTill100, 1000); //asynchronous setTimeout function
console.log("hello world");

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
