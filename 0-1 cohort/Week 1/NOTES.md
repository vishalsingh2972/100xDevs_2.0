# Why Languages?
- In the end every programming language converts the high level language 
- Languages are used to write an  application
- The C++ compiler is called g++

# Single Threaded Nature of JS
- You can search about cluster module which will help you to make use of all cores with JS (achieving multithreading)
- In go lang you create something called sub routines. It lets you fork your program.

# JS Objects
- A way to aggregate data
- object.key === object["key"] !== object[key] (In this JS tries to find the key variable and replace it with the string stored inside the variable). Most probably the way variable is replaced is pass by value.

# Callbacks
- Calling functions inside another function is known as callbacks

# Loop
- Have a look at this website: http://latentflip.com/loupe/

# Anonymous Function
- sumOfSomething(a, b, function(a){return a*a})

# Async Nature
- Busy waiting is an expensive way to achieve the async feature while synchronous nature of JS. Here you just put a logic which does nothing and loop over.
- Fetch, fileRead, setTimeout are async functions
- error first callback mechanism: 
```
fs.readFile("a.txt", "utf-8", function (err, data) { // it lets you read data from file
  console.log(data);
});
```