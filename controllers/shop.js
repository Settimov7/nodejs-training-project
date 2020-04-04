const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (request, response) => {
	Product.find()
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
	Product.find()
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
	.populate('cart.items.productId')
	.execPopulate()
	.then((user) => {
		const products = user.cart.items;

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
		return request.user.addToCart(product);
	})
	.then((result) => {
		console.log(result);
		response.redirect('/cart');
	})
	.catch((error) => console.log(error));
};

exports.postCartDeleteProduct = (request, response) => {
	const { productId } = request.body;

	request.user.removeFromCart(productId)
	.then(() => {
		response.redirect('/cart');
	})
	.catch((error) => console.log(error));
};

exports.postOrder = (request, response) => {
	request.user
	.populate('cart.items.productId')
	.execPopulate()
	.then((user) => {
		const products = user.cart.items.map(({ productId, quantity }) => ({
			product: productId._doc,
			quantity,
		}));

		const order = new Order({
			user: {
				userId: user,
				name: user.name,
			},
			products,
		});

		return order.save();
	})
	.then(() => request.user.clearCart())
	.then(() => {
		response.redirect('/orders');
	})
	.catch((error) => console.log(error));
};

exports.getOrders = (request, response) => {
	Order.find({
		'user.userId': request.user._id,
	})
	.then((orders) => {
		response.render('shop/orders', {
			pageTitle: 'Your Orders',
			path: '/orders',
			orders,
		});
	})
	.catch((error) => console.log(error));
};