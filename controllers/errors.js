exports.get404 = (request, response) => {
	response.status(404).render('404', {
		pageTitle: 'Page Not Found',
		path: '/404',
	});
};

exports.get500 = (request, response) => {
	response.status(500).render('500', {
		pageTitle: 'Error',
		path: '/500',
	});
};