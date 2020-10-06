const router = require('express').Router();
const authController = require('../controllers/authController');

router.get('/auths/verify', authController.verifyToken);
router.post('/auths/login', authController.login);
router.post('/auths/register', authController.register);

module.exports = router;
