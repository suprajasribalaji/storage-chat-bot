require('dotenv').config({path: '../../.env'});
const WebSocket = require('ws');
const PORT = process.env.WEBSOCKET_PORT || 3000;
const server = new WebSocket.Server({ port: PORT });

server.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    try {
      const parsedMessage = JSON.parse(message);
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);