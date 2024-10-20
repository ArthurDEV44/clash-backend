const Database = require('better-sqlite3');
const path = require('path');

// Chemin de votre base de données
const dbPath = path.resolve(__dirname, './database.db');
const db = new Database(dbPath);

try {
  // Exécution de la requête ALTER TABLE
  db.prepare('ALTER TABLE players ADD COLUMN points INTEGER DEFAULT 0').run();
  console.log('Colonne "points" ajoutée avec succès.');
} catch (err) {
  console.error('Erreur lors de l\'ajout de la colonne "points" :', err.message);
}

// Fermez la connexion à la base de données
db.close();
