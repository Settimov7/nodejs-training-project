const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (request, response) => {
	Product.findAll()
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
	.then(([product]) => {
		response.render('shop/product-details', {
			pageTitle: product.title,
			path: '/products',
			product: product[0],
		});
	})
	.catch((error) => console.log(error));
};

exports.getIndex = (request, response) => {
	Product.findAll()
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
	Cart.getProducts((cart) => {
		Product.fetchAll((products) => {
			const cartProducts = [];

			for (product of products) {
				const cartProduct = cart.products.find((cartProduct) => cartProduct.id === product.id);

				if (cartProduct) {
					cartProducts.push({ productData: product, quantity: cartProduct.quantity });
				}
			}

			response.render('shop/cart', {
				pageTitle: 'Your Cart',
				path: '/cart',
				products: cartProducts,
			});
		});
	});
};

exports.postCart = (request, response) => {
	const { productId } = request.body;

	Product.findById(productId, ({ id, price }) => {
		Cart.addProduct(id, price);
	});

	response.redirect('/cart');
};

exports.postCartDeleteProduct = (request, response) => {
	const { productId } = request.body;

	Product.findById(productId, ({ price }) => {
		Cart.deleteProduct(productId, price);

		response.redirect('/cart');
	});
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