function kiratsAsyncFunction() {
  let p = new Promise(function(resolve) {
    resolve("hi there");
  });
  return p;
}

const value = kiratsAsyncFunction();
value.then(function(data) {
  console.log(data);
})