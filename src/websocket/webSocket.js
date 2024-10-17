const WebSocket = require('ws');
const playerService = require('../services/playerService');

let wss;

function setupWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('A WebSocket client connected.');

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      handleWebSocketMessage(parsedMessage, ws);
    });

    ws.on('close', () => {
      console.log('A WebSocket client disconnected.');
    });
  });
}

function broadcastMessage(message, sender = null) {
  if (!wss) {
    console.error('WebSocket server not initialized');
    return;
  }
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== sender) {
      client.send(JSON.stringify(message));
    }
  });
}

// Gestion des messages WebSocket
function handleWebSocketMessage(message, ws) {
  switch (message.type) {
    case 'update_player':
      handleUpdatePlayer(message, ws);
      break;
    case 'add_map':
    case 'remove_map':
    case 'remove_player_from_clash':
    case 'clash_started':
    case 'clash_finished':
    case 'show_modal':
      broadcastMessage(message, ws);
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
}

// Gestion de la mise à jour d'un joueur
function handleUpdatePlayer(message, ws) {
  const player = message.data;
  const playerId = player.id;
  const name = player.name;

  // Mettre à jour le joueur
  playerService.updatePlayerMaps(playerId, player.maps)
    .then(() => {
      // Diffuser la mise à jour aux autres clients
      broadcastMessage({ type: 'update_player', data: player }, ws);
    })
    .catch(err => {
      console.error('Error updating player:', err);
    });
}

module.exports = {
  setupWebSocket,
  broadcastMessage,
};
