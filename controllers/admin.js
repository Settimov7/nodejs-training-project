const Product = require('../models/product');

exports.getAddProduct = (request, response) => {
	response.render('admin/add-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product'
	});
};

exports.postAddProduct = (request, response) => {
	const { title, imageUrl, description, price } = request.body;
	const product = new Product(title, imageUrl, description, price);

	product.save();

	response.redirect('/');
};

exports.getProducts = (request, response) => {
	Product.fetchAll((products) => {
		response.render('admin/products', {
			pageTitle: 'Admin Products',
			path: 'admin/products',
			prods: products
		});
	});
};