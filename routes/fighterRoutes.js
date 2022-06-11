const { Router } = require('express');
const fighterService = require('../services/fighterService');
const { responseMiddleware } = require('../middlewares/response.middleware');
const { createFighterValid, updateFighterValid } = require('../middlewares/fighter.validation.middleware');

const router = Router();

const getFighterData = (data, res, next) => {
    try {
        res.data = data;
    } catch (error) {
        res.err = error;
    } finally {
        next();
    }
};

router.get(
    '/',
    (req, res, next) => getFighterData(fighterService.getFighters(), res, next),
    responseMiddleware
);

router.get(
    '/:id',
    (req, res, next) => getFighterData(fighterService.getFighterById(req.params.id), res, next),
    responseMiddleware
);

router.post(
    '/',
    createFighterValid,
    (req, res, next) => getFighterData(fighterService.addFighter(req.body), res, next),
    responseMiddleware
);

router.put(
    '/:id',
    updateFighterValid,
    (req, res, next) => getFighterData(fighterService.updateFighter(req.params.id, req.body), res, next),
    responseMiddleware
);

router.put(
    '/:id',
    (req, res, next) => getFighterData(fighterService.deleteFighter(req.params.id), res, next),
    (req, res, next) => {
        if (res.data.length) {
            res.data = { message: `Fighter with id: ${id} deleted` };
            res.statusCode = 200;
        } else {
            res.statusCode = 404;
        }
        next();
    },
    responseMiddleware);
// TODO: Implement route controllers for fighter

module.exports = router;