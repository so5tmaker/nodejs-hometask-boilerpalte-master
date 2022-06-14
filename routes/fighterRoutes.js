const fighterService = require('../services/fighterService');
const { createFighterValid, updateFighterValid } = require('../middlewares/fighter.validation.middleware');
const commonRoutes = require('./commonRoutes');

// TODO: Implement route controllers for fighter
module.exports = commonRoutes(fighterService, createFighterValid, updateFighterValid, "Fighter");