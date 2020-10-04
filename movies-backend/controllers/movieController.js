const movieService = require('../services/movieService');
const authService = require('../services/authService');
const userService = require('../services/userService');
const CustomError = require('../utils/customError');

async function addMovie(req, res) {
	try {
		// Check if user is an Admin
		const accessToken = req.headers.authorization;
		const { error: errorAuth, data } = await authService.verifyToken(
			accessToken,
		);
		if (errorAuth) return res.status(403).send({ error: errorAuth.message });
		const uId = data.user_id;
		if (!await userService.isAdmin(uId)) {
			throw new CustomError('User is not authorized to do this job.', 403)
		}

		if (Object.keys(req.body).length === 0) {
			throw new CustomError('Request body are empty.', 400);
		}
		req.checkBody('title', 'Title is empty.').notEmpty();
		const errors = req.validationErrors();
		if (errors) {
			const message = errors.map(error => error.msg).join('. ');
			throw new CustomError(message, 400);
		}

		const newMovie = req.body;
		const { error, movie } = await movieService.addMovie(newMovie);
		if (error) throw error;
		res.status(201)
		return res.send({ results: movie });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

async function updateMovie(req, res) {
	try {
		// Check if user is an Admin
		const accessToken = req.headers.authorization;
		const { error: errorAuth, data } = await authService.verifyToken(
			accessToken,
		);
		if (errorAuth) return res.status(403).send({ error: errorAuth.message });
		const uId = data.user_id;
		if (!await userService.isAdmin(uId)) {
			throw new CustomError('User is not authorized to do this job.', 403)
		}

		if (Object.keys(req.body).length === 0) {
			throw new CustomError('Request body are empty.', 400);
		}
		if (req.body && req.body.title !== undefined) {
			req.checkBody('title', 'Title is empty.').notEmpty();
			const errors = req.validationErrors();
			if (errors) {
				const message = errors.map(error => error.msg).join('. ');
				throw new CustomError(message, 400);
			}
		}

		const { movieId } = req.params;
		const updateProp = req.body;
		const { error, updatedMovie } = await movieService.updateMovie(movieId, updateProp);
		if (error) throw error;
		return res.send({ results: updatedMovie });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

async function getAllMovie(req, res) {
	try {
		const accessToken = req.headers.authorization;
		const { error: errorAuth, data } = await authService.verifyToken(
			accessToken,
		);
		if (errorAuth) return res.status(403).send({ error: errorAuth.message });

		const { error, movies } = await movieService.getAllMovie();
		if (error) throw error;
		return res.send({ results: movies });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

module.exports = {
	addMovie,
	updateMovie,
	getAllMovie
}