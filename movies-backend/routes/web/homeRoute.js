const router = require('express').Router();
const homeController = require('../../views/controllers/homeController');

router.get('/', homeController.getHomePage);
router.get('/signup', homeController.getRegisterPage);
router.get('/login', homeController.getLoginPage);
router.post('/register', homeController.register);
router.get('/homepage', homeController.getHomePage);
router.get('/:movieId/movieDetails', homeController.getMovieDetails);
router.post('/:movieId/rateMovie', homeController.rateMovie)

module.exports = router;