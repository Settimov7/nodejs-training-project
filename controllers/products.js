const products = [];

exports.getAddProduct = (request, response) => {
	response.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
};

exports.postAddProduct = (request, response) => {
	products.push({ title: request.body.title });

	response.redirect('/');
};

exports.getProducts = (request, response) => {
	response.render('shop', { prods: products, pageTitle: 'Shop', path: '/' });
};