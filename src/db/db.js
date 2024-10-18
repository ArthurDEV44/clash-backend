const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.db');
const db = new Database(dbPath);

// Initialisation de la base de données
db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS player_maps (
    player_id INTEGER,
    map_index INTEGER,
    kills INTEGER,
    classement INTEGER,
    PRIMARY KEY (player_id, map_index),
    FOREIGN KEY (player_id) REFERENCES players(id)
  );
`);

module.exports = db;
