const router = require('express').Router();
const loginController = require('../../views/controllers/loginController');

router.post('/login', loginController.login);

module.exports = router;