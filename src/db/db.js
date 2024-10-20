const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.db');
const db = new Database(dbPath);

// Initialisation de la base de données
db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    points INTEGER DEFAULT 0 -- Nouvelle colonne pour les points
  );

  CREATE TABLE IF NOT EXISTS player_maps (
    player_id INTEGER,
    map_index INTEGER,
    kills INTEGER,
    classement INTEGER,
    PRIMARY KEY (player_id, map_index),
    FOREIGN KEY (player_id) REFERENCES players(id)
  );

  CREATE TABLE IF NOT EXISTS clash (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clashStarted INTEGER DEFAULT 0,
    clashFinished INTEGER DEFAULT 0,
    winner_id INTEGER,
    FOREIGN KEY (winner_id) REFERENCES players(id)
  );

  CREATE TABLE IF NOT EXISTS clash_players (
    clash_id INTEGER,
    player_id INTEGER,
    map_index INTEGER,
    kills INTEGER DEFAULT 0,
    classement INTEGER DEFAULT 0,
    FOREIGN KEY (clash_id) REFERENCES clash(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    PRIMARY KEY (clash_id, player_id, map_index)
  );
`);

module.exports = db;
