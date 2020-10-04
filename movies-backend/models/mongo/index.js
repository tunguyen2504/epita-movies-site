// const mongoose = require('mongoose');

// const Counter = require('./mongo/counter');
// const User = require('./mongo/user');
// const Role = require('./mongo/role');

// (async () => {
// 	const counters = [
// 		'userCounter',
// 		'movieCounter',
// 		'roleCounter'
// 	];

// 	const roles = [
// 		'ADMIN',
// 		'VIEWER'
// 	];

// 	const admin = {
// 		email: process.env.ADMIN_EMAIL,
// 		name: process.env.ADMIN_NAME,
// 		password: process.env.ADMIN_PASSWORD,
// 	}

// 	await Promise.all(
// 		counters.map(async counter => {
// 			const existCounter = await Counter.findOne({ counter });
// 			if (!existCounter) await Counter.create({ counter, sequence: 0 });
// 		}),
// 		roles.map(async role => {
// 			const existRole = await Role.findOne({ name: role });
// 			if (!existRole) await Role.create({ name: role });
// 		})
// 	);

// 	// Create an admin user at the first run of program
// 	const email = admin.email;
// 	const name = admin.name;
// 	const password = admin.password;
// 	const role = await Role.findOne({ name: 'ADMIN' });
// 	const roleId = role._id;
// 	const existAdmin = await User.findOne({ email });
// 	if (!existAdmin) await User.create({
// 		email,
// 		name,
// 		password,
// 		roleId
// 	})

// });
