const { fighter } = require("../models/fighter");
const fighterService = require("../services/fighterService");
const { responseMiddleware: middleware } = require("../middlewares/response.middleware");

const checkValuesFromTo = (res, itemValue, itemName, from, to) => {
    if (
        (itemValue && isNaN(itemValue)) ||
        (itemValue && Number(itemValue) > to) ||
        Number(itemValue) < from
    ) {
        res.status(400);
        res.err = `Please enter the ${itemName} value from ${from} to ${to}.`;
        return true;
    }
    return false;
}

const checkValues = (res, itemValue, itemName) => {
    if (itemValue) {
        res.status(400);
        res.err = `Fighter ${itemName} haven't been found!`;
        return true;
    }
    return false;
}

const commonValid = (req, res, next, isUpdate = false) => {
    const { body: newItem } = req;
    const itemKeys = Object.keys(fighter);
    const newItemKeys = Object.keys(newItem);
    const sameKeys = newItemKeys.every((key) => itemKeys.includes(key));
    const { name: newName, power, health, defense } = newItem;

    let newDataCheck = !sameKeys || newItem.id;
    if (!isUpdate) {
        newDataCheck = newDataCheck ||
            newItemKeys.length < 3 ||
            newItemKeys.length > 4;
    }
    if (newDataCheck) {
        res.status(400);
        res.err = "Invalid fighter data!";
        return middleware(req, res, next);
    }

    if (checkValues(res, newItem.length === 0, 'data')) {
        return middleware(req, res, next);
    }

    if (!isUpdate) {
        if (checkValues(res, !power, 'power')) {
            return middleware(req, res, next);
        }
        if (checkValues(res, !defense, 'defense')) {
            return middleware(req, res, next);
        }
    }

    if (checkValuesFromTo(res, power, 'power', 1, 100)) {
        return middleware(req, res, next);
    }

    if (checkValuesFromTo(res, defense, 'defense', 1, 10)) {
        return middleware(req, res, next);
    }

    let newHealth = health;
    if (!isUpdate && !health) {
        newItem.health = 100;
        newHealth = newItem.health;
    }
    if (checkValuesFromTo(res, newHealth, 'health', 80, 120)) {
        return middleware(req, res, next);
    }

    let isError = false;
    let items = fighterService.getFighters();
    if (isUpdate) {
        items = items.filter((item) => item.id !== req.params.id);
    }
    items.forEach((item) => {
        const checkLowerCase = item.name.toLowerCase() === newName.toLowerCase();
        if (newName && checkLowerCase) {
            res.status(400);
            res.err = "A fighter with such a name already exists! Please, enter a different name.";
            isError = true;
            return;
        }
    });

    if (isError) {
        return middleware(req, res, next);
    }
    next();
};

exports.createFighterValid = (req, res, next) => commonValid(req, res, next);;
exports.updateFighterValid = (req, res, next) => commonValid(req, res, next, true);