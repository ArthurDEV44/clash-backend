// clashRoutes.js
const express = require('express');
const router = express.Router();
const clashController = require('../controllers/clashController');

// Récupérer le classement des joueurs
router.get('/players/ranking', clashController.getPlayerRanking);

// Démarrer un nouveau clash
router.post('/', clashController.startClash);

// Mettre à jour le score d'un joueur pour une map spécifique dans un clash
router.put('/:clashId/player/:playerId/map/:mapIndex', clashController.updatePlayerScore);

// Terminer un clash
router.put('/:clashId/finish', clashController.finishClash);

// Supprimer les données d'un clash spécifique
router.delete('/:clashId', clashController.deleteClashData);

// Supprimer tous les clashs (nouvelle route)
router.delete('/', clashController.deleteAllClashes);


module.exports = router;
