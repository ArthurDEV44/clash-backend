// websocket.js
const WebSocket = require('ws');
const playerService = require('../services/playerService');

let wss;

// Stockage de l'état du clash sur le serveur
let clashState = {
  players: [],
  playerList: [],
  maps: [1],
  clashStarted: false,
  clashFinished: false,
  winner: null,
  showModal: false,
};

function setupWebSocket(server) {
  // Spécifiez le chemin '/ws' pour le WebSocket
  wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log("Un client WebSocket s'est connecté.");

    // Envoyer l'état initial au nouveau client
    ws.send(
      JSON.stringify({
        type: 'initial_state',
        data: clashState,
      })
    );

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      handleWebSocketMessage(parsedMessage, ws);
    });

    ws.on('close', () => {
      console.log("Un client WebSocket s'est déconnecté.");
    });
  });
}

function broadcastMessage(message, sender = null) {
  if (!wss) {
    console.error('Serveur WebSocket non initialisé');
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
    case 'update_players':
      clashState.players = message.data;
      broadcastMessage({ type: 'update_players', data: clashState.players }, ws);
      break;

    case 'update_player_list':
      clashState.playerList = message.data;
      broadcastMessage({ type: 'update_player_list', data: clashState.playerList }, ws);
      break;

    case 'add_map':
      clashState.maps.push(message.newMapIndex);
      clashState.players = message.updatedPlayers;
      broadcastMessage(
        {
          type: 'add_map',
          newMapIndex: message.newMapIndex,
          updatedPlayers: clashState.players,
        },
        ws
      );
      break;

    case 'remove_map':
      clashState.maps.pop();
      clashState.players = message.updatedPlayers;
      broadcastMessage(
        {
          type: 'remove_map',
          mapIndexToRemove: message.mapIndexToRemove,
          updatedPlayers: clashState.players,
        },
        ws
      );
      break;

    case 'remove_player_from_clash':
      clashState.players = clashState.players.filter((player) => player.id !== message.playerId);
      broadcastMessage({ type: 'remove_player_from_clash', playerId: message.playerId }, ws);
      break;

    case 'clash_started':
      clashState.clashStarted = true;
      broadcastMessage({ type: 'clash_started' }, ws);
      break;

    case 'clash_finished':
      clashState.clashStarted = false;
      clashState.clashFinished = false;
      clashState.winner = null;
      clashState.showModal = false;
      clashState.players = []; // Réinitialiser les joueurs du clash
      clashState.maps = [1]; // Réinitialiser les maps
      broadcastMessage({ type: 'clash_finished' }, ws);
      break;

    case 'show_modal':
      clashState.winner = message.winner;
      clashState.showModal = true;
      broadcastMessage({ type: 'show_modal', winner: message.winner }, ws);
      break;

    case 'new_player':
      clashState.playerList.push(message.data);
      broadcastMessage({ type: 'new_player', data: message.data }, ws);
      break;

    case 'delete_player_from_list':
      clashState.playerList = clashState.playerList.filter((player) => player.id !== message.playerId);
      broadcastMessage({ type: 'delete_player_from_list', playerId: message.playerId }, ws);
      break;

    default:
      console.log('Type de message inconnu :', message.type);
  }
}

module.exports = {
  setupWebSocket,
  broadcastMessage,
};
