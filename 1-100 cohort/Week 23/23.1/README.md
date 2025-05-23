## WebRTC - Web Real-Time Communication

## Why WebRTC?

- core protocol for real-time communication
- usual delay is 0.5s - 1s
- used for video conferencing etc.

    <br>
    <img width="502" alt="Screenshot 2024-05-04 at 7 13 01 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/78357195-6180-410d-b765-c868b2b767e7">

- different from other protocols like HLS (HTTP Live Streaming), where there is a delay. Eg: Youtube live stream has a delay of 10s

---

## Architecture

- WebRTC is a peer-to-peer protocol.
- means you can directly connect to the other person without any server in between.
- In P2P, each participant is connected to every other participant.
- For a session of N people, total connections = N \* (N-1) / 2

<br>

### Signaling

- Before the connection is established, the two peers need to exchange some information.
- Just like in the telephony world, signaling is the part where you place a phone call to a friend and their phone starts to ring. They **must accept your call for the actual conversation to initiate**.
- This part is the “signaling” — you are inviting (‘signaling’) folks to join a call, and this phase is **distinctly different/separate** from the actual data transfer during the call.
- includes the IP address of the other peer. A signalling server is used for this purpose.
- It is done mostly using websockets. Eg: socket.io, [session initiation protocol (SIP)](https://www.techtarget.com/searchunifiedcommunications/definition/Session-Initiation-Protocol) etc.

    <br>

  **Q. How does peer1 get to know the address of peer2?**
  Ans. Using the `STUN` server.

<br>

### STUN (Session Traversal Utilities for NAT)

- used to get the public IP address of the peer.
- [NAT](https://www.techtarget.com/searchnetworking/definition/Network-Address-Translation-NAT) (Network Address Translation) is used to convert the private IP address to a public IP address.
- STUN server is used to get the ice candidates (a list of IP:PORT combinations that can be used to connect to the peer) of the peer.
- In simple words, its like a phone book providing the unique location for each peer in the network.
- These ice candidates are exchanged between the peers using the signalling server. If one of the ice candidates is not working, the next one is used.

<br>

### Ice Candidates (Interactive Connectivity Establishment)

- Potential Networking endpoints that WebRTC uses to establish a connection b/w two peers.
- Each 'candidate' is a potential way/path to establish a connection.

    <br>

  **Quick Hack**: Go to `chrome://webrtc-internals` to see the WebRTC logs.

    <br>

- If two people are trying to connect on the same wifi, they can connect via private router ice candidates.
- If they are on different networks, they can connect via public ice candidates.

<br>

### TURN (Traversal Using Relays around NAT)

- A lot of times, network (NAT) doesn't allow media to come in from peer 2.
- TURN is like a fallback, if the direct connection is not permitted by the network of the user.
- **TURN server** is a relay server that relays the data between the two peers.
- In simple words, it is a middleman which relays the data between the two peers.

**A good situation to visualize the concept:**

- If you are in a corporate network, you can't connect to the other peer directly. Here, we get ice candidates from STUN server, but the media comes from peer2 directly.
- This is where router (NAT) becomes confused and blocks any external data other than the STUN server.
- In this case, TURN server is used. Here, the ice candidates are also provided by the TURN server and the media is also relayed by the TURN server.

<br>

### Offer & Answer

- Once the ice candidates are exchanged, the offer and answer are exchanged.
- **Offer** is sent by the person who initiates the call.
- **Answer** is sent by the person who receives the call.
- These contain the SDP (Session Description Protocol) _which contains all the information about the media that is being sent._

<br>

### SDP (Session Description Protocol)

- It is a format for describing multimedia communication sessions.

- A single file that contains all your:

  - ice candidates.
  - what media you want to send, what protocols you've used to encode the media.

- This is the file that is sent in the `offer` and recieved in `answer`.

![image](https://github.com/user-attachments/assets/88f479e5-fba1-4051-9bac-ed544521fac9)

<br>

### RTCPeerConnection API

- a class that browser provides to get access to the `SDP`.
- also lets us create `answer` and `offer`.
- hides all the complexity of the WebRTC protocol.

<br>

<details><summary><b>Summary</b></summary>

- You need a signalling server and a stun server to initiate a WebRTC call. You can kill these once connection is made.
- Should also include a TURN server for fallback (restrictive networks).

</details>

---

## WebRTC Connection Steps

<p align="center"><img width="968" alt="Screenshot 2024-05-04 at 8 07 36 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/929fc179-6857-4e35-98d6-d6877cbaaf76"></p>

1. Browser 1 creates an `RTCPeerConnection` object to represent the connection between the two peers.

   ```js
   const peerConnection = new RTCPeerConnection();
   ```

2. Browser 1 creates an offer using `createOffer()` method. This offer contains the SDP from browser 1.

   ```js
   const offer = await peerConnection.createOffer();
   ```

3. Browser 1 sets the local description of the peer connection to the offer. This is done to set the SDP.

   ```js
   await peerConnection.setLocalDescription(offer);
   ```

<br>

4. Browser 1 sends the offer to Browser 2 using the signalling server. This happens via a websocket connection.

<br>

5. Browser 2 receives the offer and sets the remote description of the peer connection to the offer. This is done to set the SDP of browser 1 by browser 2.

   ```js
   await peerConnection.setRemoteDescription(offer);
   ```

6. Browser 2 creates an answer using `createAnswer()` method. This answer contains the SDP from browser 2.

   ```js
   const answer = await peerConnection.createAnswer();
   ```

7. Browser 1 sets the remote description of the peer connection to the answer. This is done to set the SDP of browser 2 by browser 1.

   ```js
   await peerConnection.setRemoteDescription(answer);
   ```

<br>

The above is just the establishment of the connection. Now, the media has to be sent.

<img width="732" alt="Screenshot 2024-05-04 at 8 17 56 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/e4231d38-4682-44be-8f67-a31e9a81ed8d">

<br>

9. Browser 1 adds the local stream to the peer connection. This is done to send the media.

   ```js
   peerConnection.addStream(localStream);
   ```

10. Browser 2 listens for the `ontrack` event on the peer connection. This event is fired when the media is received.

    ```js
    peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };
    ```

11. Browser 2 sends the answer to Browser 1 using the signalling server and the loop continues.

<br>

> Note: Look at the simple demo [here](https://jsfiddle.net/rainzhao/3L9sfsvf/).

---

## Advanced Architectures

### Problems with P2P

- Although, P2P has the **lowest latency, highest security (encrypted streams), and nearly costs zero operational costs** because there are no servers required but it has some drawbacks.
- P2P is not scalable.
- If you have 1000 people in a call, each person has to connect to 999 other people. This is not possible.
- Also, because of NAT (Network Address Translation), it is not always possible to connect to the other peer directly (although TURN server can be used as a fallback).

<br>

### MCU (Multipoint Control Unit)

- In this architecture, each person sends their video & audio to the server.
- The server then decode it, and mix the audio and video from the participants together into a single stream and send it to each participant.

  <br>
  <img width="500" alt="Screenshot 2024-05-04 at 8 39 18 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/476ad6ee-c38b-4d55-bbcf-9c73dc2bd7c7">

- Another Optimization: Selects top 3 loudest audios to avoid echoes.

  <br>
  <img width="600" alt="Screenshot 2024-05-04 at 8 45 11 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/c48affef-1ed7-4b28-ae36-6ddddba946b2">

- Eg: Google Meet might use an MCU architecture.

**Best Use Case**:

- can be used for recording purposes. For eg: if you want to record a video call, you can use an MCU to mix all the videos and record it simultaneously.
- for introducing media processing like OpenCV, background blurs etc.

**Problems**:

- For different layouts, the server has to mix the videos differently. Eg: 2x2 (320p), 3x3 (480p) etc.
- If there are 1000 people in a call, the server has to mix 1000 videos.

<br>

### SFU (Selective Forwarding Unit)

<p align="center"><img width="666" alt="Screenshot 2024-05-04 at 8 29 54 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/3ab708d9-ef52-416b-8494-653487c5ee65"></p>

- In a selective forwarding topology, each participant in a session connects to a server known as a selective forwarding unit (SFU).
- This server then forwards the video to all the other people in the call.
- At its core, SFU is just a “forwarder” — meaning little to no processing happens here.
- This is scalable.
- Zoom uses a **Selective Forwarding Unit** (SFU) architecture.

**Advantages**:

- incoming connection is made to the media server, not directly to each participant
- hold different video qualities for different participants or layouts.

**Best Use Cases**:

- live streaming
- group calls

**Drawbacks**:

- less secure (media not end-to-end encrypted)
- more latency

**Difference between SFU and MCU** 👇

| SFU                                                                              | MCU                                                                                                                                                                                             |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server forwards the video to everyone.                                           | Server mixes the video and sends it back to everyone.                                                                                                                                           |
| forwards packets as it is.                                                       | decodes the packets, mixes them and encodes them again.                                                                                                                                         |
| clients only upload one stream while actively receiving N-1 streams from the SFU | each participant uploads their stream just once to the server and the server then sends one stream back to each participant, containing the mixed audio and video from all of the participants. |
| transcoding happens at the edges and not at the server.                          | transcoding happens at the server.                                                                                                                                                              |
| Less CPU intensive                                                               | More CPU intensive                                                                                                                                                                              |
| More bandwidth on a single server (if not using cascading)                                                                   | More latency                                                                                                                                                                                    |

### More Advanced Architectures (SFU Cascading & Hybrid)

**SFU Cascading**

<p align="center"><img width="700" alt="Screenshot 2024-05-04 at 8 47 20 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/d0a0b7d6-f6b4-4603-ab8a-8d6a720f755d"></p>

- When there are large number of participants, a single SFU might not be sufficient.
- In such cases, SFU cascading is used, which involves setting up multiple SFUs in a cascaded network.
- The first level SFUs (also known as root SFUs) are connected to several second level SFUs (also known as branch SFUs).
- Participant connects to nearest or most appropriate branch SFU based on their location or other criterias.
- Each SFU handles a subset of participants in a certain region using this way.
- This heirarchical structure helps in distributing the load across multiple SFUs, reducing the processing and bandwidth on each individual SFUs.
- More to read [here](https://getstream.io/glossary/sfu-cascading/).

<br>

**SFU + MCU (Hybrid)**

<p align="center"><img width="623" alt="Screenshot 2024-05-04 at 8 50 42 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/3629cadb-12fa-4043-ae9f-2040761b27c4"></p>

- In this architecture, the SFU is used for handling distribution of media streams to the participants.
- While the MCU is used for mixing the media streams from the participants, for recording or other purposes.
- This architecture combines the best of both worlds, providing the scalability of SFU and the media processing capabilities of MCU.


<br>

> A Good Article to read on all these architectures: [here](https://medium.com/secure-meeting/webrtc-architecture-basics-p2p-sfu-mcu-and-hybrid-approaches-e2aea14c80f9).

---

Slides [here](https://projects.100xdevs.com/tracks/webrtc-1/WebRTC-Basic-implementation--advance-discussion-1).
