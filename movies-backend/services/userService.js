const md5 = require('md5');
const User = require('../models/mongo/user');
const CustomError = require('../utils/customError');
const roleService = require('./roleService');

async function getUserById(userId) {
	try {
		const user = await User.findById(userId);
		return { user: user.toJSON() };
	} catch (error) {
		return { error };
	}
}

async function updateUserInfo(userId, updateProps) {
	try {
		const user = await User.findById(userId);
		if (!user) throw new CustomError('User is not found.', 404);

		const email = updateProps.email;
		const isUserExist = await User.findOne({ email });
		if (isUserExist) throw new CustomError('Email is already registered.', 409);

		const updatedUser = await User.findByIdAndUpdate(userId, updateProps, { new: true });
		return { updatedUser };
	} catch (error) {
		return { error };
	}
}

async function changePassword(userId, password, newPassword) {
	try {
		const user = await User.findById(userId);
		if (!user) throw new CustomError('User is not found.', 404);

		if (user.password !== md5(password)) throw new CustomError('Current password is not invalid.', 401);

		await User.findByIdAndUpdate(
			userId,
			{
				password: md5(newPassword),
			},
			{ new: true },
		);
		return { result: "Password is successfully changed." };
	} catch (error) {
		return { error };
	}
}

async function createUser(newUser) {
	try {
		const email = newUser.email;
		const isUserExist = await User.findOne({ email });
		if (isUserExist) throw new CustomError('Email is already registered.', 409);

		const createdUser = await User.create(newUser);
		return { createdUser: createdUser.toJSON() };
	} catch (error) {
		return { error };
	}
}

async function isAdmin(userId) {
	try {
		const { err, user } = await getUserById(userId);
		if (err) throw err;
		const roleId = user.roleId;
		const { error, role } = await roleService.getRoleById(roleId);
		if (error) throw error;
		if (role.name === "ADMIN") {
			return true;
		}
		return false;
	} catch (error) {
		return { error };
	}
}

module.exports = {
	getUserById,
	updateUserInfo,
	changePassword,
	createUser,
	isAdmin
}