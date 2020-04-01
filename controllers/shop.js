const Product = require('../models/product');

exports.getProducts = (request, response) => {
	Product.fetchAll()
	.then((products) => {
		response.render('shop/product-list', {
			pageTitle: 'All Products',
			path: '/products',
			prods: products
		});
	})
	.catch((error) => console.log(error));
};

exports.getProduct = (request, response) => {
	const { productId } = request.params;

	Product.findById(productId)
	.then((product) => {
		response.render('shop/product-details', {
			pageTitle: product.title,
			path: '/products',
			product: product,
		});
	})
	.catch((error) => console.log(error));
};

exports.getIndex = (request, response) => {
	Product.fetchAll()
	.then((products) => {
		response.render('shop/index', {
			pageTitle: 'Shop',
			path: '/',
			prods: products
		});
	})
	.catch((error) => console.log(error));
};

exports.getCart = (request, response) => {
	request.user
	.getCart()
	.then((products) => {
		response.render('shop/cart', {
			pageTitle: 'Your Cart',
			path: '/cart',
			products,
		});
	})
	.catch((error) => console.log(error));
};

exports.postCart = (request, response) => {
	const { productId } = request.body;
	Product.findById(productId)
	.then((product) => {
		return request.user.addToCard(product);
	})
	.then((result) => {
		console.log(result);
		response.redirect('/cart');
	})
	.catch((error) => console.log(error));
};

exports.postCartDeleteProduct = (request, response) => {
	const { productId } = request.body;

	request.user.deleteItemFromCart(productId)
	.then(() => {
		response.redirect('/cart');
	})
	.catch((error) => console.log(error));
};

exports.postOrder = (request, response) => {
	request.user.addOrder()
	.then(() => {
		response.redirect('/orders');
	})
	.catch((error) => console.log(error));
};

exports.getOrders = (request, response) => {
	request.user.getOrders()
	.then((orders) => {
		response.render('shop/orders', {
			pageTitle: 'Your Orders',
			path: '/orders',
			orders,
		});
	})
	.catch((error) => console.log(error));
};