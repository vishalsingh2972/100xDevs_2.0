/*
  Write a function `findLargestElement` that takes an array of numbers and returns the largest element.
  Example:
  - Input: [3, 7, 2, 9, 1]
  - Output: 9
*/

let numbers = [3, 7, 2, 9, 1];

function findLargestElement(numbers) { //function called automatically due to HOISTING
    let largestElement = numbers[0]; //initially assume first element as largest
    for(let i = 0; i<numbers.length; i++){
      if(numbers[i] > largestElement){
        largestElement = numbers[i];
      }
    }
      return largestElement;
}
console.log(findLargestElement(numbers));
