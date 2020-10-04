const router = require('express').Router();
const ratingController = require('../controllers/ratingController');

router.post('/rating/rateMovie', ratingController.rateMovie);

module.exports = router;