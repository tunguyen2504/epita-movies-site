const mongoose = require('mongoose');

const mongoConnection = {};
var conn = false;

mongoConnection.connect = async () => {
	try {
		conn = await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

mongoConnection.close = () => {
	mongoose.connection.close();
}

module.exports = mongoConnection;