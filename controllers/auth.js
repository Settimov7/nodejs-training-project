exports.getLogin = (request, response) => {
	const isAuthenticated = request.session.isLoggedIn;

	response.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		isAuthenticated,
	});
};

exports.postLogin = (request, response) => {
	request.session.isLoggedIn = true;

	response.redirect('/');
};