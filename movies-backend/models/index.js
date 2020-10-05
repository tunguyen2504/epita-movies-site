'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const db = {};
const { exec } = require('child_process');

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize("", config.username, config.password, { dialect: "mysql" });
}

try {
	sequelize.query("CREATE DATABASE IF NOT EXISTS " + process.env.MYSQL_DB + ";").then(async () => {
		// code to run after successful creation.
		await new Promise((resolve, reject) => {
			const migrate = exec(
				'npx sequelize-cli db:migrate',
				{ env: process.env },
				err => (err ? reject(err) : resolve())
			);

			// Forward stdout+stderr to this process
			migrate.stdout.pipe(process.stdout);
			migrate.stderr.pipe(process.stderr);
		});
	});
	sequelize = new Sequelize(config.database, config.username, config.password, { dialect: "mysql" });
} catch (error) {
	console.log(error);
}

fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		var model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const mongoose = require('mongoose');

const Counter = require('./mongo/counter');
const User = require('./mongo/user');
const Role = require('./mongo/role');

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
		email: process.env.ADMIN_EMAIL,
		name: process.env.ADMIN_NAME,
		password: process.env.ADMIN_PASSWORD,
	}

	await Promise.all(
		counters.map(async counter => {
			Counter.findOne({ counter }, async (err, existCounter) => {
				if (err) throw err;
				if (!existCounter) await Counter.create({ counter, sequence: 0 }, (err, result) => {
					if (err) throw err;
					if (result.counter === 'roleCounter') {
						roles.map(async role => {
							Role.findOne({ name: role }, async (err, existRole) => {
								if (err) throw err;
								if (!existRole) await Role.create({ name: role }, (error, role) => {
									if (error) throw error;
									if (role.name === 'ADMIN') {
										const email = admin.email;
										const name = admin.name;
										const password = admin.password;
										const roleId = role._id;
										User.findOne({ email }, async (err, existAdmin) => {
											if (err) throw err;
											if (!existAdmin) await User.create({
												email,
												name,
												password,
												roleId
											})
										});
									}
								});
							});
						})
					}
				});
			});
		})
	);

})();

module.exports = db;