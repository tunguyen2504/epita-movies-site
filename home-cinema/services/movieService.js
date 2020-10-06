const Movie = require('../models/mongo/movie');
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
		} else throw new CustomError('Movie is not found.', 404)
	} catch (error) {
		return { error };
	}
}

async function getMovieById(movieId) {
	try {
		const movie = await Movie.findById(movieId);
		if (!movie) throw new CustomError('Movie is not found.', 404);
		return { movie };
	} catch (err) {
		return { err };
	}
}

module.exports = {
	addMovie,
	updateMovie,
	getAllMovie,
	getMovieById
}