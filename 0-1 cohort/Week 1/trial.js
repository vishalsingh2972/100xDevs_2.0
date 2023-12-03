const personArray = ["ram", "sita", "laxman", "hanuman"];
const genderArray = ["male", "female", "male", "male",];
const numberOfUsers = personArray.length;
  // loop through and print all male / female names
for(let i = 0; i<numberOfUsers; i++){
      if (genderArray[i] == "male") {
          console.log(personArray[i]);
      }
  }