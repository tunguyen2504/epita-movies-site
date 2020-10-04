const mysqlx = require('@mysql/xdevapi');

const sqlConnection = mysqlx.getSession(process.env.MYSQL_HOST)
	.then(session => {
		console.log('MySQL connected: ' + session.inspect().host + ':' + session.inspect().port);
		var schema = session.getSchema(process.env.MYSQL_DB);
		schema.existsInDatabase().then(exists => {
			if (!exists) {
				session.createSchema(process.env.MYSQL_DB).then(schema => {
					console.log('Schema ' + schema.getName() + ' created');
				});
			} else {
				console.log('Schema ' + schema.getName() + ' found');
			}
		});
	})
	.catch(error => {
		console.log(error.message);
	})

module.exports = sqlConnection;