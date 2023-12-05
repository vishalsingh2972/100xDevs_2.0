/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]
*/

function calculateTotalSpentByCategory(Transactions) {
  let catTotal= [];

  Transactions.forEach((T) => {

    if(catTotal.hasOwnProperty(T.category)){
      catTotal[T.category] = catTotal[T.category] + T.price;
    }
    else{
      catTotal[T.category] = T.price;
    }
  });

    return catTotal;
  };

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
    itemName: 'Linkedin Premium',
    category: 'Career',
    price: 450,
    timestamp: 1658
  },
  {
    itemName: 'Netflix',
    category: 'Entertainment',
    price: 2000,
    timestamp: 1659
  },
  {
    itemName: 'Panipuri',
    category: 'Food',
    price: 100,
    timestamp: 1660
  },
  {
    itemName: 'Disney+',
    category: 'Entertainment',
    price: 1000,
    timestamp: 1661
  },
  {
    itemName: 'Twitter Blue',
    category: 'Career',
    price: 650,
    timestamp: 1662
  }
]

console.log(calculateTotalSpentByCategory(transactions));
//module.exports = calculateTotalSpentByCategory;
