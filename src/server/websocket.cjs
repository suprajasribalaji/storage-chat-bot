require('dotenv').config({path: '../../.env'});
const WebSocket = require('ws');
const PORT = process.env.PORT_WEBSOCKET || 3000;
const server = new WebSocket.Server({ port: PORT });

function wafMiddleware(message) {
  if (message.includes('blocked')) {
    throw new Error('Message contains blocked content');
  }
  return message;
}

server.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    try {
      // Apply WAF middleware
      const filteredMessage = wafMiddleware(message);
      const parsedMessage = JSON.parse(filteredMessage);
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({ error: 'Invalid message format or blocked content' }));
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`Client disconnected: ${code} - ${reason}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);