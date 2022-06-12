const { fighter } = require("../models/fighter");
const fighterService = require("../services/fighterService");
const { responseMiddleware: middleware } = require("../middlewares/response.middleware");

const createFighterValid = (req, res, next) => {
    const newFighter = req.body;
    const fighterKeys = Object.keys(fighter);
    const newFighterKeys = Object.keys(newFighter);
    const sameKeys = newFighterKeys.every((key) => fighterKeys.includes(key));
    const { newName, power, health, defense } = newFighter;

    if (
        !sameKeys ||
        newFighterKeys.length < 3 ||
        newFighterKeys.length > 4
    ) {
        res.status(400);
        res.err = "Invalid fighter data!";
        return middleware(req, res, next);
    }

    if (newFighter.length === 0) {
        res.status(400);
        res.err = "Fighter data haven't been found";
        return middleware(req, res, next);
    }

    if (!newName || newName.length === 0) {
        res.status(400);
        res.err = "Fighter name haven't been found";
        return middleware(req, res, next);
    }

    if (!power) {
        res.status(400);
        res.err = "Fighter power haven't been found";
        return middleware(req, res, next);
    }

    if (!defense) {
        res.status(400);
        res.err = "Fighter defense haven't been found";
        return middleware(req, res, next);
    }

    if (!health) {
        health = 100;
    }

    if (
        isNaN(power) ||
        Number(power) > 100 ||
        Number(power) < 1
    ) {
        res.status(400);
        res.err = "Please enter the power value from 1 to 100.";
        return middleware(req, res, next);
    }

    if (
        isNaN(defense) ||
        Number(defense) > 10 ||
        Number(defense) < 1
    ) {
        res.status(400);
        res.err = "Please enter the defense value from 1 to 10.";
        return middleware(req, res, next);
    }

    if (
        isNaN(health) ||
        Number(health) > 120 ||
        Number(health) < 80
    ) {
        res.status(400);
        res.err = "Please enter the health value from 80 to 120.";
        return middleware(req, res, next);
    }

    const fighters = fighterService.getFighters();
    fighters.map((fighter) => {
        if (fighter.name.toLowerCase() === newName.toLowerCase()) {
            res.status(400);
            res.err = "A fighter with such a name already exists! Please, enter a different name.";
            return middleware(req, res, next);
        }
    });

    // TODO: Implement validatior for fighter entity during creation
    next();
};

const updateFighterValid = (req, res, next) => {
    const { id } = req.params;
    const newFighter = req.body;
    const fighterKeys = Object.keys(fighter);
    const newFighterKeys = Object.keys(newFighter);
    const sameKeys = newFighterKeys.every((key) => fighterKeys.includes(key));
    const { newName, power, health, defense } = newFighter;

    if (!sameKeys || newFighter.id) {
        res.status(400);
        res.err = "Invalid fighter data!";
        return middleware(req, res, next);
    }

    if (newFighter.length === 0) {
        res.status(400);
        res.err = "Fighter data haven't been found";
        return middleware(req, res, next);
    }

    if (
        (power && isNaN(power)) ||
        (power && Number(power) > 100) ||
        Number(power) < 1
    ) {
        res.status(400);
        res.err = "Please enter the power value from 1 to 100.";
        return middleware(req, res, next);
    }

    if (
        (defense && isNaN(defense)) ||
        (defense && Number(defense) > 10) ||
        Number(defense) < 1
    ) {
        res.status(400);
        res.err = "Please enter the defense value from 1 to 10.";
        return middleware(req, res, next);
    }

    if (
        (health && isNaN(health)) ||
        (health && Number(health) > 120) ||
        Number(health) < 80
    ) {
        res.status(400);
        res.err = "Please enter the health value from 80 to 120.";
        return middleware(req, res, next);
    }

    const fighters = fighterService.getFighters();
    fighters
        .filter((fighter) => fighter.id !== id)
        .map((fighter) => {
            if (
                newName &&
                fighter.name.toLowerCase() === newName.toLowerCase()
            ) {
                res.status(400);
                res.err = "A fighter with such a name already exists! Please, enter a different name.";
                return middleware(req, res, next);
            }
        });

    // TODO: Implement validatior for fighter entity during update
    next();
};

exports.createFighterValid = createFighterValid;
exports.updateFighterValid = updateFighterValid;