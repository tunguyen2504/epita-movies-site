const Rating = require('../models/rating');
const CustomError = require('../utils/customError');

async function rateMovie(userId, movieId, rate) {
	try {
		await Rating.find({ where: { userId, movieId } }).then(async (rating) => {
			if (rating) {
				throw new CustomError('User has already rated this movie.', 409);
			} else {
				const rating = await Rating.create({
					userId,
					movieId,
					rate
				});
				return { rating };
			}
		})
	} catch (error) {
		return { error };
	}
}

module.exports = { rateMovie }
