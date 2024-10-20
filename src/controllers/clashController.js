const db = require('../db/db');
const { broadcastMessage } = require('../websocket/webSocket');

exports.startClash = (req, res) => {
  try {
    // Insérer un nouveau clash dans la base de données
    const stmt = db.prepare('INSERT INTO clash (clashStarted, clashFinished) VALUES (?, ?)');
    const info = stmt.run(1, 0);
    const clashId = info.lastInsertRowid;

    // Diffuser l'ID du clash à tous les clients WebSocket
    broadcastMessage({ type: 'clash_started', clashId });

    res.json({
      message: 'Clash started successfully',
      id: clashId,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePlayerScore = (req, res) => {
  const { clashId, playerId, mapIndex } = req.params;
  const { kills, rank } = req.body;

  try {
    // Mettre à jour les scores et le classement du joueur pour une map spécifique
    const stmt = db.prepare(`
        INSERT INTO clash_players (player_id, map_index, clash_id, kills, classement)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(player_id, map_index, clash_id) DO UPDATE SET kills = excluded.kills, classement = excluded.classement
      `);
      
    stmt.run(playerId, mapIndex, clashId, kills, rank);      

    res.json({ message: 'Player score updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// exports.awardPoints = (clashId) => {
//   try {
//     // Récupérer les joueurs dans le clash avec leurs scores totaux
//     const playersInClash = db.prepare(`
//       SELECT player_id, SUM(kills) as totalKills, MIN(classement) as minRank
//       FROM clash_players
//       WHERE clash_id = ?
//       GROUP BY player_id
//       ORDER BY minRank ASC, totalKills DESC
//     `).all(clashId);

//     // Attribuer des points en fonction du classement
//     playersInClash.forEach((player, index) => {
//       let points = 1; // Points par défaut pour les joueurs classés au-delà du top 3

//       if (index === 0) points = 10; // Premier joueur
//       else if (index === 1) points = 7; // Deuxième joueur
//       else if (index === 2) points = 5; // Troisième joueur

//       // Mettre à jour les points du joueur dans la table players
//       db.prepare(`
//         UPDATE players
//         SET points = points + ?
//         WHERE id = ?
//       `).run(points, player.player_id);
//     });

//     console.log('Points awarded successfully');
//   } catch (err) {
//     console.error('Error awarding points:', err.message);
//   }
// };

exports.finishClash = (req, res) => {
  const { clashId } = req.params;

  try {
    // Mettre à jour le statut du clash pour indiquer qu'il est terminé
    const stmt = db.prepare('UPDATE clash SET clashFinished = ? WHERE id = ?');
    stmt.run(true, clashId);

    // Attribuer des points aux joueurs
    // exports.awardPoints(clashId);

    // Récupérer le classement mis à jour des joueurs
    // const ranking = db.prepare('SELECT id, name, points FROM players ORDER BY points DESC').all();

    // Diffuser les points mis à jour à tous les clients WebSocket
    // broadcastMessage({ type: 'update_ranking', ranking });

    // Diffuser le message de fin de clash à tous les clients WebSocket
    broadcastMessage({ type: 'clash_finished' });

    // Supprimer les données associées à ce clash après la diffusion
    const deletePlayers = db.prepare('DELETE FROM clash_players WHERE clash_id = ?');
    const deleteClash = db.prepare('DELETE FROM clash WHERE id = ?');

    deletePlayers.run(clashId);
    deleteClash.run(clashId);

    res.json({ message: 'Clash finished and data deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteClashData = (req, res) => {
  const { clashId } = req.params;

  try {
    // Supprimer toutes les données associées à ce clash
    const deletePlayers = db.prepare('DELETE FROM clash_players WHERE clash_id = ?');
    const deleteClash = db.prepare('DELETE FROM clash WHERE id = ?');
    
    // Exécuter les requêtes de suppression
    deletePlayers.run(clashId);
    deleteClash.run(clashId);

    res.json({ message: 'Clash data deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAllClashes = (req, res) => {
  try {
    // Supprimer toutes les entrées des tables clash et clash_players
    db.prepare('DELETE FROM clash_players').run();
    db.prepare('DELETE FROM clash').run();

    res.json({ message: 'All clashes deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPlayerRanking = (req, res) => {
  try {
    const ranking = db.prepare('SELECT id, name, points FROM players ORDER BY points DESC').all();
    res.json(ranking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
