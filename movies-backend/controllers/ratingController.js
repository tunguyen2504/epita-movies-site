const ratingService = require('../services/ratingService');
const authService = require('../services/authService');
const CustomError = require('../utils/customError');

async function rateMovie(req, res) {
	try {
		const accessToken = req.headers.authorization;
		const { error: errorAuth, data } = await authService.verifyToken(
			accessToken,
		);
		if (errorAuth) return res.status(403).send({ error: errorAuth.message });

		if (Object.keys(req.body).length === 0) {
			throw new CustomError('Request body are empty.', 400);
		}
		req.checkBody('movieId', 'userId is empty.').notEmpty();
		req.checkBody('rate', 'rate must be number.').isDecimal();
		const errors = req.validationErrors();
		if (errors) {
			const message = errors.map(error => error.msg).join('. ');
			throw new CustomError(message, 400);
		}
		const userId = data.user_id;
		const { movieId, rate } = req.body;
		if (rate > 10 || rate < 0) {
			throw new CustomError('Rate point is invalid.', 400);
		}
		const { error, rating } = await ratingService.rateMovie(userId, movieId, rate);
		if (error) throw error;
		res.status(201);
		return res.send({ results: rating });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

async function calculateAndUpdateRating(req, res) {
	try {
		const accessToken = req.headers.authorization;
		const { error: errorAuth, data } = await authService.verifyToken(
			accessToken,
		);
		if (errorAuth) return res.status(403).send({ error: errorAuth.message });

		const { movieId } = req.params;
		const { error, movie } = await ratingService.calculateAndUpdateRating(movieId);
		if (error) throw error;
		return res.send({ results: movie });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

module.exports = { rateMovie, calculateAndUpdateRating }