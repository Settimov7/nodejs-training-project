const Product = require('../models/product');

exports.getAddProduct = (request, response) => {
	response.render('admin/add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
};

exports.postAddProduct = (request, response) => {
	const product = new Product(request.body.title);

	product.save();

	response.redirect('/');
};

exports.getProducts = (request, response) => {
	Product.fetchAll((products) => {
		response.render('shop/product-list', { prods: products, pageTitle: 'Shop', path: '/' });
	});
};