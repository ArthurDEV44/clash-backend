const http = require('http');
const app = require('./app');
const { setupWebSocket } = require('./websocket/webSocket');

const server = http.createServer(app);

// Configurer le serveur WebSocket
setupWebSocket(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
