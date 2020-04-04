const User = require('../models/user');

exports.getLogin = (request, response) => {
	const isAuthenticated = request.session.isLoggedIn;

	response.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		isAuthenticated,
	});
};

exports.postLogin = (request, response) => {
	User.findById('5e8826dee499c7011c520f15')
	.then((user) => {
		request.session.isLoggedIn = true;
		request.session.user = user;

		response.redirect('/');
	})
	.catch((error) => console.log(error));
};

exports.postLogout = (request, response) => {
	request.session.destroy((error) => {
		console.log(error);

		response.redirect('/');
	});
};