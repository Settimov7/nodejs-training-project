const Product = require('../models/product');

exports.getAddProduct = (request, response) => {
	response.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
};

exports.postAddProduct = (request, response) => {
	const product = new Product(request.body.title);

	product.save();

	response.redirect('/');
};

exports.getProducts = (request, response) => {
	const products = Product.fetchAll();

	response.render('shop', { prods: products, pageTitle: 'Shop', path: '/' });
};