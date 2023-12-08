/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.
*/

function isPalindrome(str) {
  let start = 0;
  let end = str.length-1;

// remove all spaces
  str = str.replace(/\s/g, ""); //used regex

// remove all punctuation marks
  str = str.replace(/[^\w\s]/gi, "");
  
  while(end>=start){
    if(str[start].toLowerCase()==str[end].toLowerCase()){
      start++;
      end--;
    }
    else{
      return false;
    }
  }
  return true;
}

console.log(isPalindrome('leveL'));
console.log(isPalindrome('level'));
console.log(isPalindrome('mole'));
console.log(isPalindrome('a'));
//module.exports = isPalindrome;
