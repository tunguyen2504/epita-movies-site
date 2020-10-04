const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/users/create', userController.createUser);
router.get('/users/:userId/info', userController.getUserById);
router.put('/users/:userId/updateInfo', userController.updateUserInfo)
router.put('/users/changePassword', userController.changePassword);

module.exports = router;