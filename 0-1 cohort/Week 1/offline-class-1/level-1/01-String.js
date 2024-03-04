// String handbook

// String: length, indexOf(), lastIndexOf(), slice(), substring(), replace(),
// split(), trim(), toUpperCase(), toLowerCase(), etc.

// Run each function to see the output, play and learn by doing.

// Length
function getLength(str) {
  console.log("Original String:", str);
  console.log("Length:", str.length);
}
getLength("Hello World");

// indexOf
function findIndexOf(str, target) {
  console.log("Original String:", str);
  console.log("Index:", str.indexOf(target));
  //console.log("Index:", str.lastIndexOf(target));
}
findIndexOf("Hello World", "World"); //World starts appearing from the 6th index onwards
findIndexOf("Vishal singh", "s");
findIndexOf("Vishal singh", "z");
findIndexOf("Hello World World", "World");// we get index of first World using .indexOf
findIndexOf("Hello World World", "World");// we get index of last World using .lastIndexOf

// lastIndexOf
function findLastIndexOf(str, target) {
  console.log("Original String:", str);
  console.log("Index:", str.lastIndexOf(target));
}
findLastIndexOf("Hello World World", "World");

// slice
function getSlice(str, start, end) {
  console.log("Original String:", str);
  console.log("After slice:", str.slice(start, end));
}
getSlice("Hello World", 0, 5);// starting from 0 until index 5 (does not include index 5 in this, basically [0,5) type)
console.log("Deepika Padukone".slice(0,9)); //direct attack without writing separate function

// Logic of slice
function cutIt(str, startIndex, endIndex) {
  let newStr = "";
  for(let i = 0; i<str.length; i++) {
    if(i >= startIndex && i<endIndex){
      newStr = newStr + str[i];
    }
  }
  return newStr;
}

const value = "Universe";

let ans2 = value.slice(0, 3);
console.log(ans2); //Uni
console.log(cutIt(value, 0, 3)); //Uni 

// substring
function getSubstring(str, start, end) {
  console.log("Original String:", str);
  console.log("After substring:", str.substring(start, end));
  console.log("After substr:", str.substr(start, end)); // the second argument to substr is the length of the string to be printed
}
getSubstring("Hello World", 0, 5);
console.log("Deepika Padukone".substr(2,9));//starting from index 2 and length of the substr must be 9
console.log("Deepika Padukone".slice(2,9)); 
console.log("Deepika Padukone".substring(2,9));

// replace: it replaces the string if found, if not just returns the original string
function replaceString(str, target, replacement) {
  console.log("Original String:", str);
  console.log("After replace:", str.replace(target, replacement));
}
replaceString("Republic of India", "India", "Bharat");
const str = "Hello World";
console.log(str.replace('world','Mumbo Jumbo'));
console.log(str.replace('World','JavaScript'));

// split: it splits your string in an array based on a delimiter.
function splitString(str, separator) {
  console.log("Original String:", str);
  console.log("After split:", str.split(separator));
}
splitString("Hello World", " ");
splitString("Hello World", "");

// trim: lets you trim out the extra space from start and end of the string
function trimString(str) {
  console.log("Original String:", str);
  console.log("After trim:", str.trim());
}
trimString(" Hello World "); //trim removes extra spaces at the beginning and the end

// toUpperCase
function toUpper(str) {
  console.log("Original String:", str);
  console.log("After toUpperCase:", str.toUpperCase());
}
toUpper("Hello World");

// toLowerCase
function toLower(str) {
  console.log("Original String:", str);
  console.log("After toLowerCase:", str.toLowerCase());
}
toLower("Hello World");
