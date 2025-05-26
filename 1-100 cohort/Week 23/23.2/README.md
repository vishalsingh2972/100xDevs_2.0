# Implementing WebRTC

---

## Quick Summary of Steps

   <p align="center"><img width="800" alt="Screenshot 2024-05-05 at 7 14 38 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/df7974ae-8967-4acb-817c-37756495d264"></p>

1. Creating **Signalling Server** for handling connection.

   - Total of three messages are to be exchanged.
   - Browser1 sends an offer to Browser2.
   - Browser2 sends an answer to Browser1.
   - Browser1 sends its ice candidates to Browser2 and vice-versa

   <br>

2. Creating **Sender** Frontend. Its job:

   - sends the offer to the receiver.
   - sends the video stream to the receiver.
   - sends its ice candidates to the receiver.
   - gets the answer from the receiver.
   - gets the ice candidates from the receiver.

   <br>

3. Creating **Receiver** Frontend. Its job:
   - gets the offer from the sender.
   - sends the answer to the sender.
   - sends its ice candidates to the sender.
   - checks for any tracks (media streams) that are added to the connection and displays them.

---

## Implementing Signalling Server (Backend)

1. Setup new TS project. or Go to `/webrtc/backend` folder.

   <br>

2. Install the packages using `npm i`. It installs `ws`, `express` libraries.

   <details>

    <summary><b>why websockets?</b></summary>
    
      - websockets are the common protocol to push anything to the server.

   </details>

   <br>

3. Go through the `index.ts` file to understand the code. To check the working, try running `npm start`.

   <br>

4. Now, we need to setup the message handling part betweeen sender and receiver.

   <details><summary><b>Explaination</b></summary>

   - Firtly, a simple `websocket` server is created using `ws` library.
   - we initialize two variables to store the websockets of the two browsers.
   - whenever a message is sent through the websocket server, it contains the type of message and the payload.
   - For the first time, `message.type` is `sender` or `receiver`, then we store the sender/receiver's websocket the first time.
   - For the second time, `message.type` is `offer` or `answer`, then we send the message to the receiver/sender.
   - For the third time, `message.type` is `ice-candidate`, then we send sender's ice candidates to the receiver.
   - After all the above three informations are exchanged, the connection is established.

   </details>

---

## Implementing Sender & Receiver (Frontend)

1.  Initialize a react-app using `npx create-vite@latest` or go to `/webrtc/frontend` folder.

   <br>

2.  Install the required packages using `npm i`. It installs the `react-router-dom`, `socket.io-client` libraries.

   <br>

3.  Check the `src/components/` folder to check the `Sender.tsx` and `Receiver.tsx` files.

    - `Sender.tsx` contains the code for sending the offer to the receiver.
    - `Receiver.tsx` contains the code for sending the answer to the sender.

    <br>

4.  Understanding **`Sender.tsx`**:

      <br>
      
    - As soon as the component mounts, it sends the message to server that it is a 'sender' in useEffect.

      <br>

    - When the user clicks on the **button** 'send video', a RTCPeerConnection object is created (which contains the SDP, ICE candidates and other infos).

      <br>

    - First, we keep an `socket.onmessage` to listen to incoming messages from the receiver:

      - If the receiver sent the `answer` i.e if `message.type` is `createAnswer`, we store the answer in `remoteDescription`.
      - If the receiver sends its `ice candidates` i.e if `message.type` is `iceCandidate`, we keep adding the ice candidates using `pc.addIceCandidate`.

      <br>

    - Now, we create an offer using `createOffer` and set it as the local description.

      - We send this offer to the receiver.
      - One more thing: whenever a change happens (like video/audio gets added), the SDP changes. Thus we need to keep sending the updated SDP to the receiver by wrapping the above three actions inside `pc.ononnegotiationneeded`.

      <br>

    - We also keep sending the ice candidates to the receiver as they are generated.

      <br>

    - In the end, we create a video element and set the stream to it. Go through the code to understand it better.

    <br>

5.  Understanding **`Receiver.tsx`**:

      <br>
      
    - As soon as the component mounts, it sends the message to server that it is a 'receiver' in useEffect.
      
      <br>

    - Along with that, we start the function (`startReceiving`) to receive incoming content from sender.

      <br>

    - Inside the function:

      - We start with creating the RTCPeerConnection object.
      - We keep listening to the incoming messages from the sender using `socket.onmessage`.
      - If `message.type` is `createOffer`, we fulfill the basic formalities of setting the remote description and adding the ice candidates. In the end, we create an answer and send it to the sender.
      - Additionally, we keep sending the ice candidates to the sender as they are generated.
      - If `message.type` is `iceCandidate`, we keep adding the ice candidates to the sender.
      - In the end, we keep checking for any tracks (media streams) that are added to the connection. If they are added, we create a video element and set the stream to it. Go through the code to understand it better.

      <br>

      ### <p align="center">Congratulations! You have successfully implemented WebRTC. 🎉</p>

![image](https://github.com/user-attachments/assets/725c99ca-e9d0-4829-a734-7f91a33c813e)

## WebRTC Internals: Open Chrome and go to `chrome://webrtc-internals/`

![image](https://github.com/user-attachments/assets/590e1178-0bd1-439c-9338-fa00d0e91afb)

