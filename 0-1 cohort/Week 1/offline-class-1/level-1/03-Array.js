// Array handbook

// Array:   push(), pop(), shift(), unshift(), splice(), slice(),
// concat(), forEach(), map(), filter(), reduce(), find(), sort()

// Run each function to see the output, play and learn by doing.

// push()
function pushExample(arr, element) {
  console.log("Original Array:", arr);

  arr.push(element);
  console.log("After push:", arr);
}
pushExample([1, 2, 3], 4);

// pop()
function popExample(arr) {
  console.log("Original Array:", arr);

  arr.pop();
  console.log("After pop:", arr);
  arr.pop();
  console.log("After pop:", arr);
  arr.pop();
  console.log("After pop:", arr);
}
popExample([1, 2, 3]);

// shift(): pulls out from the front of the array
function shiftExample(arr) {
  console.log("Original Array:", arr);

  arr.shift();
  console.log("After shift:", arr);
  arr.shift();
  console.log("After shift:", arr);
  arr.shift();
  console.log("After shift:", arr);
}
shiftExample([1, 2, 3]);

// unshift()
function unshiftExample(arr, element) {
  console.log("Original Array:", arr);

  arr.unshift(element);
  console.log("After unshift:", arr);
  // arr.unshift(element-1);
  // console.log("After unshift:", arr);
}
unshiftExample([1, 2, 3], 0);

// concat()
function concatExample(arr1, arr2) {
  console.log("Original Arrays:", arr1, arr2);

  let arr3 = arr1.concat(arr2);
  console.log("After concat:", arr3);
  let arr4 = arr2.concat(arr1);
  console.log("After concat:", arr4);
}
concatExample([1, 2, 3], [4, 5, 6]);

const firstArray = [1, 2, 3];
const secondArray = [4, 5, 6];
// const finalArray = firstArray.concat(secondArray);
// console.log(finalArray);
console.log(firstArray.concat(secondArray));

// forEach(): it will call a function for each element of an array
function forEachExample(arr) {
  console.log("Original Array:", arr);

  arr.forEach(function(item, index) {
    console.log('for number = ' + item, ", index is " + index);
  });
}
forEachExample([1, 2, 3]);

const initialArray = [1, 2, 3];

function logThing(str){
  console.log(str);
}
initialArray.forEach(logThing); //at each index logThing function is called

// imp., needs understanding of callbacks: map, filter, find, sort

// map()
function mapExample(arr) {
  console.log("Original Array:", arr);

  let newArr = arr.map(function(item) { //here item is element at each index of arr that is being passed
    return item * 2;
  });
  console.log("After map:", newArr);
}
mapExample([1, 2, 3]);

// filter()
function filterExample(arr) {
  console.log("Original Array:", arr);

  let newArr = arr.filter(function(item) {
    return item > 3;
  });
  console.log("After filter:", newArr);
}
filterExample([1, 2, 3, 4, 5]);

// find()
function findExample(arr) {
  console.log("Original Array:", arr);

  let found = arr.find(function(item) {
    return item > 3;
  });
  console.log("After find:", found);
}
findExample([1, 2, 3, 4, 5]);

// sort()
function sortExample(arr) {
  console.log("Original Array:", arr);

  arr.sort(function(a, b) {
    return a - b;
  });
  console.log("After sort:", arr);
}
sortExample([5, 2, 3, 4, 1]);
