//This is my Redis pub-sub's code that I am using to recieve data from the worker's and forward it to the websocket server 
//This Redis pub-sub is also in the same container as my Redis queue

import { createClient } from 'redis';
import WebSocket from 'ws';

const redisClient = createClient();

// WebSocket client to send data to the WebSocket server
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('✅ Pub-Sub connected to WebSocket Server');
});

ws.on('error', (err) => {
  console.error('❌ WebSocket Error in Pub-Sub:', err);
});

async function startSubscriber() {
  try {
    await redisClient.connect();
    console.log('📡 Subscriber connected to Redis.');

    await redisClient.subscribe('problem_done_pub_sub', (message) => {
      console.log(`📬 Received from Redis pub-sub: ${message}`);

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message); // 👉 Send message to WebSocket server
      } else {
        console.warn('⚠️ WebSocket not ready. Could not forward message.');
      }
    });

    console.log('🕐 Subscriber listening for messages...');
  } catch (error) {
    console.error('🚨 Failed to connect to Redis:', error);
  }
}

startSubscriber();
