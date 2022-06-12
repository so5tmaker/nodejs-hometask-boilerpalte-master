const { user } = require('../models/user');
const userService = require("../services/userService");
const { responseMiddleware: middleware } = require("../middlewares/response.middleware");

const pswdLength = 3;

const createUserValid = (req, res, next) => {
    const newUser = req.body;
    const userKeys = Object.keys(user);
    const newUserKeys = Object.keys(newUser);
    const sameKeys = newUserKeys.every((key) => userKeys.includes(key));
    const { email, phoneNumber, password } = newUser;

    if (!sameKeys || newUserKeys.length !== 5) {
        res.status(400);
        res.err = "Invalid user data!";
        return middleware(req, res, next);
    }

    if (newUserKeys.length === 0) {
        res.status(400);
        res.err = "User data haven't been found";
        return middleware(req, res, next);
    }

    if (!email.includes("@gmail")) {
        res.status(400);
        res.err = "Please, use gmail only";
        return middleware(req, res, next);
    }

    if (
        phoneNumber.slice(0, 4) !== "+380" ||
        phoneNumber.length !== 13
    ) {
        res.status(400);
        res.err = "The phone number should be in the following format: +380xxxxxxxxx";
        return middleware(req, res, next);
    }

    if (password.length < pswdLength) {
        res.status(400);
        res.err = `The password must be at least ${pswdLength} characters long`;
        return middleware(req, res, next);
    }

    const users = userService.getUsers();
    users.map((user) => {
        if (user.email.toLowerCase() === email.toLowerCase()) {
            res.status(400);
            res.err = "A user with such an email address already exists! Please, use a different email address.";
            return middleware(req, res, next);
        }
        if (user.phoneNumber.toLowerCase() === phoneNumber.toLowerCase()) {
            res.status(400);
            res.err = "A user with such a phone number already exists! Please, use a different phone number.";
            return middleware(req, res, next);
        }
    });

    // TODO: Implement validatior for user entity during creation
    next();
};

const updateUserValid = (req, res, next) => {
    const { id } = req.params;
    const newUser = req.body;
    const userKeys = Object.keys(user);
    const newUserKeys = Object.keys(newUser);
    const sameKeys = newUserKeys.every((key) => userKeys.includes(key));
    const { email, phoneNumber, password } = newUser;

    if (!sameKeys) {
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

    if (
        (phoneNumber && phoneNumber.slice(0, 4) !== "+380") ||
        (phoneNumber && phoneNumber.length !== 13)
    ) {
        res.status(400);
        res.err = "The phone number should be in the following format: +380xxxxxxxxx";
        return middleware(req, res, next);
    }

    if (password && password.length < pswdLength) {
        res.status(400);
        res.err = `The password must be at least ${pswdLength} characters long`;
        return middleware(req, res, next);
    }

    const users = userService.getUsers();
    users
        .filter((user) => user.id !== id)
        .map((user) => {
            if (
                email &&
                user.email.toLowerCase() === email.toLowerCase()
            ) {
                res.status(400);
                res.err = "A user with such an email address already exists! Please, use a different email address.";
                return middleware(req, res, next);
            }
            if (
                phoneNumber &&
                user.phoneNumber.toLowerCase() === phoneNumber.toLowerCase()
            ) {
                res.status(400);
                res.err = "A user with such a phone number already exists! Please, use a different phone number.";
                return middleware(req, res, next);
            }
        });

    // TODO: Implement validatior for user entity during update
    next();
};

exports.createUserValid = createUserValid;
exports.updateUserValid = updateUserValid;