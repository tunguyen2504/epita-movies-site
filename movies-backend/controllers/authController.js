const authService = require('../services/authService');
const CustomError = require('../utils/customError');

async function verifyToken(req, res, next) {
	try {
		const { authorization: accessToken } = req.headers;
		const { data } = await authService.verifyToken(accessToken);
		if (!data) throw new CustomError('User is not authorized.', 401);
		res.send({ results: data });
	} catch (error) {
		next(error);
	}
}

async function login(req, res) {
	try {
		if (Object.keys(req.body).length === 0) {
			throw new CustomError('Request body are empty.', 400);
		} else {
			req.checkBody('email', 'Invalid email.').isEmail();
			req.checkBody('password', 'Password is empty.').notEmpty();
			const errors = req.validationErrors();
			if (errors) {
				const message = errors.map(error => error.msg).join('. ');
				throw new CustomError(message, 400);
			}
		}
		const { email, password } = req.body;
		const { error, accessToken } = await authService.login(email, password);
		if (error) throw error;
		return res.send({ results: { accessToken } });
	} catch (error) {
		res.status(error.statusCode || 500)
		return res.send({ error: error.message })
	}
}

async function register(req, res) {
	try {
		if (Object.keys(req.body).length === 0) {
			throw new CustomError('Request body are empty.', 400);
		} else {
			req.checkBody('name', 'Name is empty.').notEmpty();
			req.checkBody('email', 'Invalid email.').isEmail();
			req.checkBody('password', 'Password is empty.').notEmpty();

			const errors = req.validationErrors();
			if (errors) {
				const message = errors.map(error => error.msg).join('. ');
				throw new CustomError(message, 400);
			}
		}
		const { name, email, password, contact } = req.body;
		const { error, user } = await authService.register(
			name,
			email,
			password,
			contact
		);
		if (error) throw error;
		res.status(201)
		return res.send({ results: user });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

module.exports = {
	verifyToken,
	login,
	register,
};
