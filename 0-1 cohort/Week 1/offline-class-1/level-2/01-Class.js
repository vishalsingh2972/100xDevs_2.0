class Animal {
  constructor(name, legCount, speaks) {
    this.name = name;
    this.legCount = legCount;
    this.speaks = speaks;
  }
  static myType(){// these functions are not associated to the incoming objects but rather these are associated to the class Animal itself 
    console.log("I depend on class Animal");
  }
  speak(){
    console.log('Hi there ' + this.speaks);
  }
}
Animal.myType();// static functions can be called directly via the class without the need to instantiate an object to call the function
//Animal.speak(); //error -  speak function is not static so cannot be called via class Animal, needs to be called via an object
let dog =  new Animal("dog", 4, "bhow bhow"); //create object
let cat =  new Animal("cat", 4, "meow meow");
cat.speak(); //call function on object


// class Animal {
//   constructor(name, legCount) {
//     this.name = name
//     this.legCount = legCount
//   }
//   describe() {
//     return `${this.name} has ${this.legCount} legs`
//   }
// }


