exports.get404 = (request, response) => {
	response.status(404).render('404', {
		pageTitle: 'Page Not Found',
		path: '',
	});
};