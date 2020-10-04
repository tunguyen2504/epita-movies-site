const router = require('express').Router();
const roleController = require('../controllers/roleController');

router.post('/roles/create', roleController.createRole);
router.get('/roles/getAll', roleController.getAllRole);

module.exports = router;