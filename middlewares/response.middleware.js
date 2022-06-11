const responseMiddleware = (req, res, next) => {
    if (res.statusCode === 200 && res.data) {
        return res.status(res.statusCode).json(res.data);
    }
    if (res.err) {
        return res
            .status(res.statusCode)
            .json({ error: true, message: `${res.err}` });
    }
    if (res.statusCode) {
        return res.status(404).json({
            error: true,
            message: "Requested data haven't been found",
        });
    }
    // TODO: Implement middleware that returns result of the query
    next();
}

exports.responseMiddleware = responseMiddleware;