// create a map function that takes 2 inputs
// an array, and a transformation callback/fn
// and transforms the array into a new one using the transformation fn
function map (arr, callback) {
    let newArr = [];
    for(let i = 0; i<arr.length; i++){
        newArr.push(callback(arr[i]));
    }
    return newArr;
}

console.log(map([1,2,3], (i)=>i*2));
//filtering
// what if I tell u, given an input array, give me
// back all the even values from it

// filter, map, arrow fns, forEach, reduce,
// spread, destructuring, spread operator, destructuring, spread operator,
