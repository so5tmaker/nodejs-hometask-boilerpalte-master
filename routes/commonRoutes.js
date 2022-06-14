const { Router } = require('express');
const { responseMiddleware: middleware } = require('../middlewares/response.middleware');

const commmonRouter = (commonService, createValid, updateValid, name = "User") => {
    const router = Router();

    const getData = (data, res, next) => {
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
        (req, res, next) => getData(commonService[`get${name}s`](), res, next),
        middleware
    );

    router.get(
        '/:id',
        (req, res, next) => getData(commonService[`get${name}ById`](req.params.id), res, next),
        middleware
    );

    router.post(
        '/',
        createValid,
        (req, res, next) => getData(commonService[`add${name}`](req.body), res, next),
        middleware
    );

    router.put(
        '/:id',
        updateValid,
        (req, res, next) => getData(commonService[`update${name}`](req.params.id, req.body), res, next),
        middleware
    );

    router.delete(
        '/:id',
        (req, res, next) => getData(commonService[`delete${name}`](req.params.id), res, next),
        (req, res, next) => {
            if (res.data.length) {
                res.data = { message: `${name} with id: ${req.params.id} was deleted` };
                res.statusCode = 200;
            } else {
                res.statusCode = 404;
            }
            next();
        },
        middleware);

    return router;
}
// TODO: Implement route controllers for user

module.exports = commmonRouter;