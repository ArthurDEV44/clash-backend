const playerService = require('../services/playerService');
const { broadcastMessage } = require('../websocket/webSocket');

exports.getAllPlayers = (req, res) => {
  try {
    const players = playerService.getAllPlayers(); // Récupérer tous les joueurs disponibles
    res.json(players);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Exemple dans playerController.js
exports.createPlayer = (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Player name is required' });
  }

  try {
    const newPlayer = playerService.createPlayer(name);

    // Informer tous les clients WebSocket du nouveau joueur
    broadcastMessage({ type: 'new_player', data: newPlayer });

    // Répondre avec le nouvel ID du joueur
    res.json({
      message: 'success',
      id: newPlayer.id,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePlayerMaps = (req, res) => {
  const playerId = req.params.id;
  const { maps } = req.body;

  if (!Array.isArray(maps)) {
    return res.status(400).json({ error: 'Invalid maps data' });
  }

  try {
    playerService.updatePlayerMaps(playerId, maps);
    res.json({ message: 'Player maps updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePlayer = (req, res) => {
  const playerId = req.params.id;

  try {
    playerService.deletePlayer(playerId);

    // Informer tous les clients WebSocket de la suppression du joueur
    broadcastMessage({ type: 'delete_player_from_list', playerId: parseInt(playerId) });

    res.json({ message: 'Player removed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
