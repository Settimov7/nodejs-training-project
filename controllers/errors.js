exports.get404 = (request, response) => {
	const isAuthenticated = request.session.isLoggedIn;

	response.status(404).render('404', {
		pageTitle: 'Page Not Found',
		path: '',
		isAuthenticated,
	});
};