//Create a terminal clock (HH:MM:SS)

//Way 1
setInterval(() => { //setInterval() for this function to load again and again at every 1000 milliseconds/1 sec
  let time = new Date().toLocaleTimeString(); //this is function to print time in HH:MM:SS format
  console.log(time);
},1000);


//Way 2
function clock() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  console.log(`${hours}:${minutes}:${seconds}`);
}
setInterval(clock, 1000);
// To run the function every second we can utilise the setInterval() method.
// the setInterval() method takes two arguments, a function and a time in milliseconds.
// It runs the function every time the time specified in milliseconds has passed.

