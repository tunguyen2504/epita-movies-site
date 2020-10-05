const router = require('express').Router();
const seenMovieController = require('../controllers/seenMovieController');

router.post('/seenMovie', seenMovieController.addSeenTime);
router.get('/seenMovie/:movieId/countViews', seenMovieController.countTotalViewsByMovieId);
router.get('/seenMovie/recentWatched', seenMovieController.getRecentWatchedMoviesByUserId);

module.exports = router;