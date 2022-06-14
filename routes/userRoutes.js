const userService = require('../services/userService');
const { createUserValid, updateUserValid } = require('../middlewares/user.validation.middleware');
const commonRoutes = require('./commonRoutes');

// TODO: Implement route controllers for user

module.exports = commonRoutes(userService, createUserValid, updateUserValid);