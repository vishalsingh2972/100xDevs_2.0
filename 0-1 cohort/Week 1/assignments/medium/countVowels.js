/*
  Implement a function `countVowels` that takes a string as an argument and returns the number of vowels in the string.
  Note: Consider both uppercase and lowercase vowels ('a', 'e', 'i', 'o', 'u').

  Once you've implemented the logic, test your code by running
*/

// function countVowels(str) {
//     // Your code here
// }

// module.exports = countVowels;

const allUsers2 = [{ 
  firstName: "Vishal",
  gender: "male",
  metadata:{
    age: "1",
    role: "bhakti"
}
},{
  firstName: "Krishna",
  gender: "male",
  metadata:{
      age: "10",
      role: "Shaktimaan"
  }
},{
  firstName: "Radha",
  gender: "female",
  metadata:{
    age: "12",
    role: "Shakti"
}
}]
for(let i = 0; i<allUsers2.length; i++){
  if(allUsers2[i]["metadata"]["role"]=="Shaktimaan"){
    console.log(allUsers2[i]["firstName"]);
  }
}