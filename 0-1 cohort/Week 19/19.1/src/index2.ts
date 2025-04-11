// WebSocket Server with Express and 'ws' WebSocket library
import express from 'express';
import WebSocket, { WebSocketServer } from 'ws';

const app = express();
const server = app.listen(8080);

app.get('/', (req, res) => {
  //console.log((new Date()) + ' Received request for ' + req.url);
  res.send("hi there");
});

const wss = new WebSocketServer({ server });

let usercount = 0;
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  console.log("user connected", ++usercount);
  ws.send('Hello! Message From Server!!');
});