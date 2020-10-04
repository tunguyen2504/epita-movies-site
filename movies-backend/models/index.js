const mongoose = require('mongoose');

const Counter = require('../models/counter');
const User = require('../models/user');
const Role = require('../models/role');

(async () => {
	const counters = [
		'userCounter',
		'movieCounter',
		'roleCounter'
	];

	const roles = [
		'ADMIN',
		'VIEWER'
	];

	const admin = {
		email: 'superadmin@epitamovies.com',
		name: 'Admin',
		password: 'admin@123',
	}

	await Promise.all(
		counters.map(async counter => {
			const existCounter = await Counter.findOne({ counter });
			if (!existCounter) await Counter.create({ counter, sequence: 0 });
		}),
		roles.map(async role => {
			const existRole = await Role.findOne({ name: role });
			if (!existRole) await Role.create({ name: role });
		})
	);

	// Create an admin user at the first run of program
	const email = admin.email;
	const name = admin.name;
	const password = admin.password;
	const role = await Role.findOne({ name: 'ADMIN' });
	const roleId = role._id;
	const existAdmin = await User.findOne({ email });
	if (!existAdmin) await User.create({
		email,
		name,
		password,
		roleId
	})

})();