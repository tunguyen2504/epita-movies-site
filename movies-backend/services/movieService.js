const Movie = require('../models/movie');
const CustomError = require('../utils/customError');

async function addMovie(newMovie) {
	try {
		const movie = await Movie.create(newMovie);
		return { movie }
	} catch (error) {
		return { error };
	}
}

async function updateMovie(movieId, updateProps) {
	try {
		const movie = await Movie.findById(movieId);
		if (!movie) throw new CustomError('Movie is not found.', 404);
		const updatedMovie = await Movie.findByIdAndUpdate(movieId, updateProps, { new: true });
		return { updatedMovie };
	} catch (error) {
		return { error };
	}
}

async function getAllMovie() {
	try {
		const movies = await Movie.find();
		if (movies && movies.length) {
			return { movies }
		}
	} catch (error) {
		return { error };
	}
}

module.exports = {
	addMovie,
	updateMovie,
	getAllMovie
}