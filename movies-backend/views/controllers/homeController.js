const loginController = require('./loginController');
const axios = require('axios');
const hostURL = process.env.SERVER + process.env.PORT + "/api";

function getLoginPage(req, res) {
	res.render('login');
}

function getRegisterPage(req, res) {
	res.render('register');
}

async function getHomePage(req, res) {
	const authToken = req.cookies['authToken'];
	if (!authToken) {
		res.redirect('/login');
	} else {
		loginController.verifyToken(authToken).then(async userId => {
			getHomePageData(authToken).then(data => {
				res.render('home', {
					movies: data.movies,
					recentMovies: data.recentMovies
				});
			}).catch(err => {
				if (err.response) {
					res.render('home', {
						message: err.response.data.error,
						messageClass: 'alert-danger'
					});
				}
			})
		}).catch(err => {
			if (err.response) {
				res.redirect('/login');
			}
		});
	}
}

async function getMovieDetails(req, res) {
	const authToken = req.cookies['authToken'];
	const { movieId } = req.params;
	if (!authToken) {
		res.redirect('/login');
	} else {
		loginController.verifyToken(authToken).then(userId => {
			getMovieById(authToken, movieId).then(movie => {
				res.render('detail', {
					movie: movie
				});
			}).catch(err => {
				if (err.response) {
					res.redirect('/login');
				}
			});
		}).catch(err => {
			if (err.response) {
				res.redirect('/login');
			}
		});
	}
}

function getHomePageData(authToken) {
	return new Promise(async (resolve, reject) => {
		var movies = [];
		var recentMovies = [];
		// var bestMovies = [];
		const allMovieOptions = {
			method: 'GET',
			url: `${hostURL}/movies/getAll`,
			headers: {
				authorization: authToken
			}
		};
		await axios(allMovieOptions).then(response => {
			movies = response.data.results;
			// console.log(movies)
		}).catch(err => {
			if (err.response) {
				reject(err);
			}
		});
		const recentMovieOptions = {
			method: 'GET',
			url: `${hostURL}/seenMovie/recentWatched`,
			headers: {
				authorization: authToken
			}
		};
		await axios(recentMovieOptions).then(response => {
			recentMovies = response.data.results;
			// console.log(recentMovies);
		}).catch(err => {
			if (err.response) {
				reject(err);
			}
		});
		var data = {
			movies: movies,
			recentMovies: recentMovies
		}
		resolve(data);
	})
}

function getMovieById(authToken, movieId) {
	return new Promise(async (resolve, reject) => {
		var movie = {};
		const options = {
			method: 'GET',
			url: `${hostURL}/movies/${movieId}/get`,
			headers: {
				authorization: authToken
			}
		};
		await axios(options).then(response => {
			movie = response.data.results;
			resolve(movie);
		}).catch(err => {
			if (err.response) {
				reject(err);
			}
		});
		const seenOptions = {
			method: 'POST',
			url: `${hostURL}/seenMovie`,
			data: {
				movieId
			},
			headers: {
				authorization: authToken
			}
		};
		await axios(seenOptions).then(response => { }).catch(err => {
			if (err.response) {
				reject(err);
			}
		})
	})
}

async function rateMovie(req, res) {
	const authToken = req.cookies['authToken'];
	const { movieId } = req.params;
	const rate = req.body.star;
	if (!authToken) {
		res.redirect('/login');
	} else {
		loginController.verifyToken(authToken).then(userId => {
			rateAndUpdateRating(authToken, movieId, rate).then(movie => {
				console.log(movie)
				res.render('detail', {
					movie: movie
				});
			}).catch(err => {
				if (err.response) {
					res.render('detail', {
						message: err.response.data.error,
						messageClass: 'alert-danger'
					});
				}
			});
		}).catch(err => {
			if (err.response) {
				res.redirect('/login');
			}
		});
	}
}

function rateAndUpdateRating(authToken, movieId, rate) {
	return new Promise(async (resolve, reject) => {
		const rateOptions = {
			method: 'POST',
			url: `${hostURL}/rating/rateMovie`,
			data: {
				movieId,
				rate
			},
			headers: {
				authorization: authToken
			}
		};
		await axios(rateOptions).then(response => {
			const res = response.data.results;
		}).catch(err => {
			if (err.response) {
				reject(err);
			}
		});
		const calculateRatingOptions = {
			method: 'PUT',
			url: `${hostURL}/rating/${movieId}/updateRating`,
			headers: {
				authorization: authToken
			}
		}
		await axios(calculateRatingOptions).then(response => {
			const movie = response.data.results;
			resolved(movie);
		}).catch(err => {
			if (err.response) {
				reject(err);
			}
		});
	})
}

async function register(req, res) {
	const { email, password, name, country, area, city, street, number } = req.body;
	const options = {
		method: 'POST',
		url: `${hostURL}/auths/register`,
		data: {
			name,
			email,
			password,
			contact: {
				address: {
					country,
					area,
					city,
					street,
					number
				}
			}
		}
	};
	await axios(options).then(response => {
		const user = response.data.results;
		res.redirect('/login');
	}).catch(err => {
		if (err.response) {
			res.render('login', {
				message: err.response.data.error,
				messageClass: 'alert-danger'
			});
		}
	});
} 

module.exports = {
	getLoginPage,
	getRegisterPage,
	getHomePage,
	getMovieDetails,
	rateMovie,
	register
}