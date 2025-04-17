//This is my Websocket server code that is recieving data from the Redis pub-sub and sending it to the frontend user/client

import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';

const app = express();
const server = app.listen(8080, () => {
  console.log(new Date() + ' WebSocket Server is listening on port 8080');
});

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  console.log('🔗 New client connected to WebSocket');

  ws.on('message', function incoming(message) {
    console.log('📥 Received from client:', message.toString());
  });

  ws.send('👋 Hello from WebSocket server!');
});

// Broadcast utility function
export function broadcastToClients(data: any) {
  const message = typeof data === 'string' ? data : JSON.stringify(data);

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  // ✅ Your desired console log
  const parsed = JSON.parse(message);
  console.log(`📤 Problem ID: ${parsed.problemId}, Status: ${parsed.status}`);
}
