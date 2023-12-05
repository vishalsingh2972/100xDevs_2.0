/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]
*/

function calculateTotalSpentByCategory(TRANS) {
    let foodPrice = 0, clothingPrice = 0;

    TRANS.forEach((i) => {
      if(i.category === 'Food'){
        foodPrice += i.price;
        console.log(foodPrice);
      }
      if(i.category === 'Clothing'){
        clothingPrice += i.price;
      }
    })
      
    const ans = [
      {
        category: 'Food',
        totalprice: foodPrice
      },
      {
        category: 'Clothing',
        totalprice: clothingPrice
      }];


      return ans;

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
    itemName: 'Panipuri',
    category: 'Food',
    price: 100,
    timestamp: 1658
  }
]

console.log(calculateTotalSpentByCategory(transactions));

//module.exports = calculateTotalSpentByCategory;
