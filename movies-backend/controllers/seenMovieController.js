const seenMovieService = require('../services/seenMovieService');
const authService = require('../services/authService');
const CustomError = require('../utils/customError');

async function addSeenTime(req, res) {
	try {
		const accessToken = req.headers.authorization;
		const { error: errorAuth, data } = await authService.verifyToken(
			accessToken,
		);
		if (errorAuth) return res.status(403).send({ error: errorAuth.message });

		if (Object.keys(req.body).length === 0) {
			throw new CustomError('Request body are empty.', 400);
		}
		req.checkBody('movieId', 'movieId is empty.').notEmpty();
		const errors = req.validationErrors();
		if (errors) {
			const message = errors.map(error => error.msg).join('. ');
			throw new CustomError(message, 400);
		}
		const userId = data.user_id;
		const { movieId } = req.body;
		const { error, seenMovie } = await seenMovieService.addSeenTime(userId, movieId);
		if (error) throw error;
		res.status(201);
		return res.send({ results: seenMovie });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

async function countTotalViewsByMovieId(req, res) {
	try {
		const accessToken = req.headers.authorization;
		const { error: errorAuth, data } = await authService.verifyToken(
			accessToken,
		);
		if (errorAuth) return res.status(403).send({ error: errorAuth.message });

		const { movieId } = req.params;
		const { error, result } = await seenMovieService.countTotalViewsByMovieId(movieId);
		if (error) throw error;
		return res.send({ results: result });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

async function getRecentWatchedMoviesByUserId(req, res) {
	try {
		const accessToken = req.headers.authorization;
		const { error: errorAuth, data } = await authService.verifyToken(
			accessToken,
		);
		if (errorAuth) return res.status(403).send({ error: errorAuth.message });
		const userId = data.user_id;
		const { error, results } = await seenMovieService.getRecentWatchedMoviesByUserId(userId);
		if (error) throw error;
		return res.send({ results });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

module.exports = {
	addSeenTime,
	countTotalViewsByMovieId,
	getRecentWatchedMoviesByUserId
}