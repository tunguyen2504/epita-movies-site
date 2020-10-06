const roleService = require('../services/roleService');
const authService = require('../services/authService');
const userService = require('../services/userService');
const CustomError = require('../utils/customError');

async function createRole(req, res) {
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
		req.checkBody('name', 'Role name is empty.').notEmpty();
		const errors = req.validationErrors();
		if (errors) {
			const message = errors.map(error => error.msg).join('. ');
			throw new CustomError(message, 400);
		}

		const { name } = req.body;
		const { error, role } = await roleService.createRole(name);
		if (error) throw error;
		res.status(201);
		return res.send({ results: role });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

async function getAllRole(req, res) {
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

		const { error, roles } = await roleService.getAllRole();
		if (error) throw error;
		return res.send({ results: roles });
	} catch (error) {
		res.status(error.statusCode || 500);
		return res.send({ error: error.message });
	}
}

module.exports = { createRole, getAllRole }