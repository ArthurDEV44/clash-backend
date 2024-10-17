const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

// Initialisation de la base de données
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS player_maps (
      player_id INTEGER,
      map_index INTEGER,
      kills INTEGER,
      classement INTEGER,
      PRIMARY KEY (player_id, map_index),
      FOREIGN KEY (player_id) REFERENCES players(id)
    )
  `);
});

module.exports = db;
