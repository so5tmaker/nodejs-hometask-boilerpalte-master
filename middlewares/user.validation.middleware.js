const { user } = require('../models/user');
const userService = require("../services/userService");
const { responseMiddleware: middleware } = require("../middlewares/response.middleware");

const pswdLength = 3;

const checkValues = (res, user, item, itemName, itemDefinition, isUpdate) => {
    if (item) {
        const checkLowerCase = user[itemName].toLowerCase() === item.toLowerCase();
        const checkUpdate = isUpdate ? item && checkLowerCase : checkLowerCase;
        if (checkUpdate) {
            res.status(400);
            res.err = `A user with such a/an ${itemDefinition} already exists! Please, use a different ${itemDefinition}`;
            return true;
        }
    }
    return false;
}

const commonValid = (req, res, next, isUpdate = false) => {
    const newUser = req.body;
    const userKeys = Object.keys(user);
    const newUserKeys = Object.keys(newUser);
    const sameKeys = newUserKeys.every((key) => userKeys.includes(key));
    const { email, phoneNumber, password } = newUser;

    let checkUpdate = !sameKeys || newUser.id;
    if (!isUpdate) {
        checkUpdate = checkUpdate || newUserKeys.length !== 5;
    }
    if (checkUpdate) {
        res.status(400);
        res.err = "Invalid user data!";
        return middleware(req, res, next);
    }

    if (newUserKeys.length === 0) {
        res.status(400);
        res.err = "User data haven't been found";
        return middleware(req, res, next);
    }

    if (email && !email.includes("@gmail")) {
        res.status(400);
        res.err = "Please, use gmail only";
        return middleware(req, res, next);
    }

    if ((phoneNumber && phoneNumber.slice(0, 4) !== "+380") ||
        (phoneNumber && phoneNumber.length !== 13)) {
        res.status(400);
        res.err = "The phone number should be in the following format: +380xxxxxxxxx";
        return middleware(req, res, next);
    }

    if (password && password.length < pswdLength) {
        res.status(400);
        res.err = `The password must be at least ${pswdLength} characters long`;
        return middleware(req, res, next);
    }

    let isError = false;
    let users = userService.getUsers();
    if (isUpdate) {
        users = users.filter((item) => item.id !== req.params.id);
    }
    users.forEach(user => {
        isError = checkValues(res, user, email, 'email', 'email address', isUpdate);
        if (isError) {
            return;
        }
        isError = checkValues(res, user, phoneNumber, 'phoneNumber', 'phone number', isUpdate);
        if (isError) {
            return;
        }
    });

    if (isError) {
        return middleware(req, res, next);
    }
    next();
};

const createUserValid = (req, res, next) => {
    commonValid(req, res, next);
};

const updateUserValid = (req, res, next) => {
    commonValid(req, res, next, true);
};

exports.createUserValid = createUserValid;
exports.updateUserValid = updateUserValid;