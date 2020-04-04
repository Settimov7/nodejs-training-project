exports.getLogin = (request, response) => {
	response.render('auth/login', {
		pageTitle: 'Login',
		path: 'login',
	});
};