// WebSocket Server using native 'http' module and 'ws' WebSocket library
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

const server = http.createServer(function (request: any, response: any) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.end("hi there");
});

const wss = new WebSocketServer({ server });

let usercount = 0;
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) { //EXTRA : if (client !== ws && client.readyState === WebSocket.OPEN) { ~ this way you can brodcast message to all other clients/users excluding the sender
        client.send(data, { binary: isBinary });
      }
    });
  });

  console.log("user connected", ++usercount);
  ws.send('Hello! Message From Server!!');
});

server.listen(8080, function () {
  console.log((new Date()) + ' Server is listening on port 8080');
});