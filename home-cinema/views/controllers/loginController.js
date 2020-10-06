const axios = require('axios');
const hostURL = process.env.SERVER + process.env.PORT + "/api";

async function login(req, res) {
	const { email, password } = req.body;
	const options = {
		method: 'POST',
		url: `${hostURL}/auths/login`,
		data: {
			email,
			password
		}
	};
	await axios(options).then(response => {
		const authToken = response.data.results.access_token;
		res.cookie('authToken', authToken);
		res.redirect('/homepage');
	}).catch(err => {
		if (err.response) {
			res.render('login', {
				message: err.response.data.error,
				messageClass: 'alert-danger'
			});
		}
	});
}

function verifyToken(authToken) {
	return new Promise(async (resolve, reject) => {
		const options = {
			method: 'GET',
			url: `${hostURL}/auths/verify`,
			headers: {
				authorization: authToken
			}
		};
		await axios(options).then(response => {
			const userId = response.data.results.user_id;
			resolve(userId);
		}).catch(err => {
			if (err.response) {
				reject(err);
			}
		})
	})
}

module.exports = {
	login,
	verifyToken
}