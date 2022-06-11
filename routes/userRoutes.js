const { Router } = require('express');
const userService = require('../services/userService');
const { createUserValid, updateUserValid } = require('../middlewares/user.validation.middleware');
const { responseMiddleware } = require('../middlewares/response.middleware');

const router = Router();

const getUserData = (data, res, next) => {
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
    (req, res, next) => getUserData(userService.getUsers(), res, next),
    responseMiddleware
);

router.get(
    '/:id',
    (req, res, next) => getUserData(userService.getUserById(req.params.id), res, next),
    responseMiddleware
);

router.post(
    '/',
    createUserValid,
    (req, res, next) => getUserData(userService.addUser(req.body), res, next),
    responseMiddleware
);

router.put(
    '/:id',
    updateUserValid,
    (req, res, next) => getUserData(userService.updateUser(req.params.id, req.body), res, next),
    responseMiddleware
);

router.put(
    '/:id',
    (req, res, next) => getUserData(userService.deleteUser(req.params.id), res, next),
    (req, res, next) => {
        if (res.data.length) {
            res.data = { message: `User with id: ${id} deleted` };
            res.statusCode = 400;
        } else {
            res.statusCode = 404;
        }
        next();
    },
    responseMiddleware);
// TODO: Implement route controllers for user

module.exports = router;