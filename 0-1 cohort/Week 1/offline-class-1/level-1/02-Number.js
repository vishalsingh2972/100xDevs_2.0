function explainParseInt(value) {
  console.log("Original Value:", value);
  let result = parseInt(value); // parseInt it is a global function
  console.log("After parseInt:", result);
}

// Example Usage for parseInt
explainParseInt("42"); //42
explainParseInt("42px"); //42
explainParseInt("3.14"); //3
explainParseInt("px42"); //NaN
explainParseInt("vishal"); //NaN

function explainParseFloat(value) {
  console.log("Original Value:", value);
  let result = parseFloat(value);
  console.log("After parseFloat:", result);
}

// Example Usage for parseFloat
explainParseFloat("3.14");
explainParseFloat("42");
explainParseFloat("42px");

console.log(parseInt("3.14"));
console.log(parseFloat("3.14"));
