const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (request, response) => {
	Product.fetchAll((products) => {
		response.render('shop/product-list', {
			pageTitle: 'All Products',
			path: '/products',
			prods: products
		});
	});
};

exports.getProduct = (request, response) => {
	const { productId } = request.params;

	Product.findById(productId, (product) => {
		response.render('shop/product-details', { pageTitle: product.title, path: '/products', product });
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

exports.postCart = (request, response) => {
	const { productId } = request.body;

	Product.findById(productId, ({ id, price }) => {
		Cart.addProduct(id, price);
	});

	response.redirect('/cart');
};

exports.getOrders = (request, response) => {
	response.render('shop/orders', {
		pageTitle: 'Your Orders',
		path: '/orders'
	});
};


exports.getCheckout = (request, response) => {
	response.render('shop/checkout', {
		pageTitle: 'Checkout',
		path: '/checkout'
	});
};