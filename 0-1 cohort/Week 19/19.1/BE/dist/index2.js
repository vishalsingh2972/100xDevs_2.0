"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// WebSocket Server with Express and 'ws' WebSocket library
const express_1 = __importDefault(require("express"));
const ws_1 = __importStar(require("ws"));
const app = (0, express_1.default)();
const server = app.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});
app.get('/', (req, res) => {
    //console.log((new Date()) + ' Received request for ' + req.url);
    res.send("hi there");
});
const wss = new ws_1.WebSocketServer({ server });
let usercount = 0;
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data, isBinary) {
        console.log('Server received message:', data.toString());
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === ws_1.default.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    console.log("user connected", ++usercount);
    ws.send('Hello! Message From Server!!');
});
