//Calculate the time it takes between a setTimeout call and the inner function actually running

let start = new Date().getTime();

setTimeout(() => {
    let end = new Date().getTime();
    console.log(`${end - start} ms`);
}, 1000);

//when value gets stored in start represents the moment when the setTimeout() function is called.
//So, What are we finding here is - The time it takes between the moment the value is stored in start and the moment the entire setTimeout() function finishes executing

//IMP
//the first time you run the code, the answer will be relatively accurate, as the time difference between the start timestamp and the end timestamp will primarily reflect the time it takes for the callback function to execute. However, as you continue to run the code repeatedly, the time differences may become less accurate due to the accumulation of delays introduced by the setTimeout() function.