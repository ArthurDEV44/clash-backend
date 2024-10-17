const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Récupérer tous les joueurs
router.get('/', playerController.getAllPlayers);

// Ajouter un joueur
router.post('/', playerController.createPlayer);

// Mettre à jour les maps d'un joueur
router.put('/:id/maps', playerController.updatePlayerMaps);

// Supprimer un joueur
router.delete('/:id', playerController.deletePlayer);

module.exports = router;
