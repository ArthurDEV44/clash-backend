const db = require('../db/db');

exports.getAllPlayers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM players', [], (err, players) => {
      if (err) {
        return reject(err);
      }

      const playerDataPromises = players.map(player => {
        return new Promise((resolve, reject) => {
          db.all('SELECT map_index, kills, classement FROM player_maps WHERE player_id = ?', [player.id], (err, maps) => {
            if (err) {
              reject(err);
            } else {
              player.maps = maps;
              resolve();
            }
          });
        });
      });

      Promise.all(playerDataPromises)
        .then(() => {
          resolve(players);
        })
        .catch(err => {
          reject(err);
        });
    });
  });
};

exports.createPlayer = (name) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO players (name) VALUES (?)`,
      [name],
      function (err) {
        if (err) {
          return reject(err);
        }

        const newPlayer = { id: this.lastID, name };
        resolve(newPlayer);
      }
    );
  });
};

exports.updatePlayerMaps = (playerId, maps) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM player_maps WHERE player_id = ?`, [playerId], function (err) {
      if (err) {
        return reject(err);
      }

      const stmt = db.prepare(`INSERT INTO player_maps (player_id, map_index, kills, classement) VALUES (?, ?, ?, ?)`);
      maps.forEach(map => {
        stmt.run([playerId, map.map_index, map.kills, map.classement]);
      });
      stmt.finalize(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
};

exports.deletePlayer = (playerId) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM player_maps WHERE player_id = ?`, [playerId], function (err) {
      if (err) {
        return reject(err);
      }

      db.run(`DELETE FROM players WHERE id = ?`, [playerId], function (err) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
};
