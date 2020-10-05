const router = require('express').Router();
const ratingController = require('../controllers/ratingController');

router.post('/rating/rateMovie', ratingController.rateMovie);
router.put('/rating/:movieId/updateRating', ratingController.calculateAndUpdateRating);

module.exports = router;