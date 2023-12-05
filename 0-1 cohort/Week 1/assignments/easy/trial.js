const array = [];


const obj1 = [
{ naam: "W", age: 1 },
{ naam: "Pooja", age: 2 },
{ naam: "Vishal", age: 3 },];


obj1.forEach(X =>{
  console.log(X.naam);
  array[X.naam] = X.age; //By using array[X.naam] = X.age, you are indeed adding a pair of "naam" and "age" inside the array
})






const transactions = [
  {
    itemName: 'Pizza',
    category: 'Food',
    price: 300,
    timestamp: 1656
  },
  {
    itemName: 'Jeans',
    category: 'Clothing',
    price: 5000,
    timestamp: 1657
  },
  {
    itemName: 'Panipuri',
    category: 'Food',
    price: 100,
    timestamp: 1658
  }
]



function calculateTotalSpentByCategory(transactions) {
  let catTotal= [];

  transactions.forEach((transaction) => {
    
    if(catTotal.hasOwnproperty(transaction.category)){
      catTotal[transactions.category] = catTotal[transactions.category] + transactions.price;
    }
    else{
      catTotal[transactions.category] = transactions.price;
    }











