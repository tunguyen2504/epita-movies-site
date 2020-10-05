const Rating = require('../models').Rating;
const Movie = require('../models/mongo/movie');
const userService = require('./userService');
const movieService = require('./movieService');
const CustomError = require('../utils/customError');

async function rateMovie(userId, movieId, rate) {
	try {
		const { error, user } = await userService.getUserById(userId);
		if (error) throw error;
		const { err, movie } = await movieService.getMovieById(movieId);
		if (err) throw err;
		const ratingExists = await Rating.findOne({ where: { userId, movieId } });
		if (ratingExists) {
			throw new CustomError('User has already rated this movie.', 409);
		} else {
			const data = await Rating.create({
				userId,
				movieId,
				rate
			});
			const rating = data.get({ plain: true });
			return { rating };
		}
	} catch (error) {
		return { error };
	}
}

async function calculateAndUpdateRating(movieId) {
	try {
		const { err, data } = await movieService.getMovieById(movieId);
		if (err) throw err;
		const { count, rows } = await Rating.findAndCountAll({ where: { movieId } });
		var finalRating = 0;
		console.log(count);
		rows.map(row => {
			const rating = row.get({ plain: true });
			finalRating += rating.rate;
			console.log(rating);
			console.log(finalRating);
		})
		finalRating = (finalRating / count).toFixed(2);
		console.log(finalRating);
		const movie = await Movie.findByIdAndUpdate(movieId, { rating: finalRating }, { new: true });
		return { movie }
	} catch (error) {
		return { error };
	}
}

module.exports = { rateMovie, calculateAndUpdateRating }
