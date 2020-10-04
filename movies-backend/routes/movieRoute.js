const router = require('express').Router();
const movieController = require('../controllers/movieController');

router.post('/movies/add', movieController.addMovie);
router.put('/movies/:movieId/update', movieController.updateMovie);
router.get('/movies/getAll', movieController.getAllMovie);

module.exports = router;