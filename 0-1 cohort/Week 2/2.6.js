//map, filter, arrow functions

//✅ arrow functions
// function sum(a,b){
//   return a + b;
// }

const sum = (a,b) => {
  return a + b;
}

const ans = sum(1,2);
//console.log(ans);

//✅ map
const arr = [1, 2, 3, 4, 5];

// const transform = (i) => {
//   return i*2;
// }
// function transform(i){
//   return i*2;
// }
// const ans2 = arr.map(transform);

const ans2 = arr.map((i) => {
  return i*2;
});
//console.log(ans2);

//✅ filter
const arr2 = [1, 2, 3, 4, 5];

// function filterLogic(n){
//   if(n % 2 == 0){
//     return true;
//   }
//   else{
//     return false;
//   }
// }
// const ANS = arr.filter(filterLogic);

const ANS = arr2.filter(function filterLogic(n){
    if(n % 2 == 0){
      return true;
    }
    else{
      return false;
    }
});
//console.log(ANS);

//✅ startsWith function
console.log("Alisha".startsWith("A"));
