const userService = require('../services/userService');
const { camelcase } = require('../utils/camelCase');
const authService = require('../services/authService');
const CustomError = require('../utils/customError');

async function getUserById(req, res) {
	try {
		// Check if user is an Admin or the current User
		const accessToken = req.headers.authorization;
		const { error: errorAuth, data } = await authService.verifyToken(
			accessToken,
		);
		if (errorAuth) return res.status(403).send({ error: errorAuth.message });
		const uId = data.user_id;
		const { userId } = req.params;
		if (uId !== userId) {
			if (!await userService.isAdmin(uId)) {
				throw new CustomError('User is not authorized to do this job.', 403)
			} else {
				const { error, user } = await userService.getUserById(userId);
				if (error) throw error;
				return res.send({ results: user });
			}
		}
		const { error, user } = await userService.getUserById(userId);
		if (error) throw error;
		return res.send({ results: user });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

async function updateUserInfo(req, res) {
	try {
		// Check if user is the current User
		const accessToken = req.headers.authorization;
		const { error: errorAuth, data } = await authService.verifyToken(
			accessToken,
		);
		if (errorAuth) return res.status(403).send({ error: errorAuth.message });
		const uId = data.user_id;
		const { userId } = req.params;
		const updateProp = req.body;
		if (uId !== userId) {
			throw new CustomError('User is not authorized to do this job.', 403)
		}
		if (Object.keys(req.body).length === 0) {
			throw new CustomError('Request body are empty.', 400);
		}
		if (updateProp.roleId !== undefined) {
			throw new CustomError('User is not authorized to change roleId.', 403)
		}
		if (req.body && req.body.email !== undefined) {
			req.checkBody('email', 'Invalid email.').isEmail();
			const errors = req.validationErrors();
			if (errors) {
				const message = errors.map(error => error.msg).join('. ');
				throw new CustomError(message, 400);
			}
		}
		const { error, updatedUser } = await userService.updateUserInfo(userId, updateProp);
		if (error) throw error;
		return res.send({ results: updatedUser });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

async function changePassword(req, res) {
	try {
		if (Object.keys(req.body).length === 0) {
			throw new CustomError('Request body are empty.', 400);
		} else {
			req.checkBody('password', 'Current password is empty.').notEmpty();
			req.checkBody('newPassword', 'New password is empty.').notEmpty();
			const errors = req.validationErrors();
			if (errors) {
				const message = errors.map(error => error.msg).join('. ');
				throw new CustomError(message, 400);
			}
		}
		const accessToken = req.headers.authorization;
		const { error: errorAuth, data } = await authService.verifyToken(
			accessToken,
		);
		if (errorAuth) return res.status(403).send({ error: errorAuth.message });
		const userId = data.user_id;
		const { password, newPassword } = req.body;
		const { error, result } = await userService.changePassword(
			userId,
			password,
			newPassword,
		);
		if (error) throw error;
		return res.send({ results: result });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

async function createUser(req, res) {
	try {
		// Check if user is an Admin
		const accessToken = req.headers.authorization;
		const { error: errorAuth, data } = await authService.verifyToken(
			accessToken,
		);
		if (errorAuth) return res.status(403).send({ error: errorAuth.message });
		const userId = data.user_id;
		if (!await userService.isAdmin(userId)) {
			throw new CustomError('User is not authorized to do this job.', 403)
		}

		if (Object.keys(req.body).length === 0) {
			throw new CustomError('Request body are empty.', 400);
		} else {
			req.checkBody('name', 'Name is empty.').notEmpty();
			req.checkBody('email', 'Invalid email.').isEmail();
			req.checkBody('password', 'Password is empty.').notEmpty();
			req.checkBody('roleId', 'roleId is empty.').notEmpty();
			const errors = req.validationErrors();
			if (errors) {
				const message = errors.map(error => error.msg).join('. ');
				throw new CustomError(message, 400);
			}
		}

		const newUser = req.body;
		const { error, createdUser } = await userService.createUser(newUser);
		if (error) throw error;
		res.status(201);
		return res.send({ results: createdUser });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

module.exports = {
	getUserById,
	updateUserInfo,
	changePassword,
	createUser
}