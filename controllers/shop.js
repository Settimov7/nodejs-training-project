const Product = require('../models/product');

exports.getProducts = (request, response) => {
	Product.fetchAll((products) => {
		response.render('shop/product-list', {
			pageTitle: 'All Products',
			path: '/products',
			prods: products
		});
	});
};

exports.getIndex = (request, response) => {
	Product.fetchAll((products) => {
		response.render('shop/index', {
			pageTitle: 'Shop',
			path: '/',
			prods: products
		});
	});
};

exports.getCart = (request, response) => {
	response.render('shop/cart', {
		pageTitle: 'Your Cart',
		path: '/cart'
	});
};

exports.getCheckout = (request, response) => {
	response.render('shop/checkout', {
		pageTitle: 'Checkout',
		path: '/checkout'
	});
};