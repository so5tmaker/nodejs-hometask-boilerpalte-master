const { Router } = require('express');
const AuthService = require('../services/authService');
const { responseMiddleware: middleware } = require('../middlewares/response.middleware');

const router = Router();

router.post('/login', (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (email) {
            res.data = AuthService.login({ email, password });
        } else {
            throw Error("Invalid user credentials!");
        }
        // TODO: Implement login action (get the user if it exist with entered credentials)
    } catch (err) {
        res.err = err;
    } finally {
        next();
    }
}, middleware);

module.exports = router;