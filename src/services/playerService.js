const db = require('../db/db');

exports.getAllPlayers = () => {
  try {
    // Récupérer tous les joueurs
    const players = db.prepare('SELECT * FROM players').all();

    // Pour chaque joueur, récupérer ses maps
    players.forEach(player => {
      const maps = db.prepare('SELECT map_index, kills, classement FROM player_maps WHERE player_id = ?').all(player.id);
      player.maps = maps;
    });

    return players;
  } catch (err) {
    throw err;
  }
};

exports.createPlayer = (name) => {
  try {
    const stmt = db.prepare('INSERT INTO players (name) VALUES (?)');
    const info = stmt.run(name);

    const newPlayer = { id: info.lastInsertRowid, name };
    return newPlayer;
  } catch (err) {
    throw err;
  }
};

exports.updatePlayerMaps = (playerId, maps) => {
  try {
    // Supprimer les maps existantes du joueur
    const deleteStmt = db.prepare('DELETE FROM player_maps WHERE player_id = ?');
    deleteStmt.run(playerId);

    // Insérer les nouvelles maps dans une transaction
    const insertStmt = db.prepare('INSERT INTO player_maps (player_id, map_index, kills, classement) VALUES (?, ?, ?, ?)');
    const insertMany = db.transaction((maps) => {
      for (const map of maps) {
        insertStmt.run(playerId, map.map_index, map.kills, map.classement);
      }
    });

    insertMany(maps);
  } catch (err) {
    throw err;
  }
};

exports.deletePlayer = (playerId) => {
  try {
    // Supprimer les maps du joueur
    const deleteMapsStmt = db.prepare('DELETE FROM player_maps WHERE player_id = ?');
    deleteMapsStmt.run(playerId);

    // Supprimer le joueur
    const deletePlayerStmt = db.prepare('DELETE FROM players WHERE id = ?');
    deletePlayerStmt.run(playerId);
  } catch (err) {
    throw err;
  }
};
