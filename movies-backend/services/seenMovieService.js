const SeenMovie = require('../models').SeenMovie;
const Movie = require('../models/mongo/movie');
const userService = require('./userService');
const movieService = require('./movieService');
const CustomError = require('../utils/customError');

async function addSeenTime(userId, movieId) {
	try {
		const { error, user } = await userService.getUserById(userId);
		if (error) throw error;
		const { err, movie } = await movieService.getMovieById(movieId);
		if (err) throw err;
		const data = await SeenMovie.create({
			userId,
			movieId,
			seenTime: Date.now()
		});
		const seenMovie = data.get({ plain: true });
		seenMovie.title = movie.title;
		seenMovie.directors = movie.directors;
		seenMovie.releaseDate = movie.releaseDate;
		seenMovie.thumbnailUrl = movie.thumbnailUrl;
		return { seenMovie };
	} catch (error) {
		return { error };
	}
}

async function countTotalViewsByMovieId(movieId) {
	try {
		const { err, movie } = await movieService.getMovieById(movieId);
		if (err) throw err;
		const { count, rows } = await SeenMovie.findAndCountAll({ where: { movieId } });
		const result = { movie };
		result.views = count;
		return { result };
	} catch (error) {
		return { error };
	}
}

async function getRecentWatchedMoviesByUserId(userId) {
	try {
		const { error, user } = await userService.getUserById(userId);
		if (error) throw error;
		const recentMovies = await SeenMovie.findAll({
			attributes: ['movieId', 'seenTime'],
			where: { userId },
			order: [['seenTime', 'DESC']],
			raw: true
		});
		// To reduce concurrent movie in data
		var results = [];
		recentMovies.map(async recentMovie => {
			if (!results.some(e => e.movieId === recentMovie.movieId)) {
				results.push(recentMovie);
			}
		})
		return { results };
	} catch (error) {
		return { error };
	}
}

module.exports = {
	addSeenTime,
	countTotalViewsByMovieId,
	getRecentWatchedMoviesByUserId
}