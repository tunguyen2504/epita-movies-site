const jwt = require('jsonwebtoken');
const md5 = require('md5');
const User = require('../models/mongo/user');
const Role = require('../models/mongo/role');
const CustomError = require('../utils/customError');

const { JWT_SECRET_KEY } = process.env;
const EXPIRES_TIME = '1h';

async function verifyToken(accessToken) {
	try {
		const data = await jwt.verify(accessToken, JWT_SECRET_KEY);
		return { data };
	} catch (error) {
		return { error };
	}
}

async function login(email, password) {
	try {
		const user = await User.findOne({ email });
		if (
			!user ||
			user.password !== md5(password)
		)
			throw new CustomError('Email or password is invalid.', 401);

		const accessToken = jwt.sign({ user_id: user._id }, JWT_SECRET_KEY, {
			expiresIn: EXPIRES_TIME,
		});
		return { accessToken };
	} catch (error) {
		return { error };
	}
}

async function register(name, email, password, contact) {
	try {
		const isUserExists = await User.findOne({ email });
		if (isUserExists) throw new CustomError('Email is already registered.', 409);
		const role = await Role.findOne({ name: 'VIEWER' });
		const roleId = role._id;

		const user = await User.create({
			name,
			email,
			password,
			contact,
			roleId
		});
		return { user: user.toJSON() };
	} catch (error) {
		return { error };
	}
}

module.exports = { verifyToken, login, register };