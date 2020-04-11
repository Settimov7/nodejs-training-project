const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (request, response, next) => {
	const page = +request.query.page || 1;
	let totalItems;

	Product.find()
	.countDocuments()
	.then((numberOfProducts) => {
		totalItems = numberOfProducts;

		return Product.find()
		.skip((page - 1) * ITEMS_PER_PAGE)
		.limit(ITEMS_PER_PAGE)
	})
	.then((products) => {
		response.render('shop/product-list', {
			pageTitle: 'Products',
			path: '/products',
			prods: products,
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < totalItems,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
		});
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.getProduct = (request, response, next) => {
	const { productId } = request.params;

	Product.findById(productId)
	.then((product) => {
		response.render('shop/product-details', {
			pageTitle: product.title,
			path: '/products',
			product: product,
		});
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.getIndex = (request, response, next) => {
	const page = +request.query.page || 1;
	let totalItems;

	Product.find()
	.countDocuments()
	.then((numberOfProducts) => {
		totalItems = numberOfProducts;

		return Product.find()
		.skip((page - 1) * ITEMS_PER_PAGE)
		.limit(ITEMS_PER_PAGE)
	})
	.then((products) => {
		response.render('shop/index', {
			pageTitle: 'Shop',
			path: '/',
			prods: products,
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < totalItems,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
		});
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.getCart = (request, response, next) => {
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
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.postCart = (request, response, next) => {
	const { productId } = request.body;
	Product.findById(productId)
	.then((product) => {
		return request.user.addToCart(product);
	})
	.then((result) => {
		console.log(result);
		response.redirect('/cart');
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.postCartDeleteProduct = (request, response, next) => {
	const { productId } = request.body;

	request.user.removeFromCart(productId)
	.then(() => {
		response.redirect('/cart');
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.postOrder = (request, response, next) => {
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
				email: user.email,
			},
			products,
		});

		return order.save();
	})
	.then(() => request.user.clearCart())
	.then(() => {
		response.redirect('/orders');
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.getOrders = (request, response, next) => {
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
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.getInvoice = (request, response, next) => {
	const orderId = request.params.orderId;

	Order.findById(orderId)
	.then((order) => {
		if (!order) {
			return next(new Error('No order found.'));
		}

		if (order.user.userId.toString() !== request.user._id.toString()) {
			return next(new Error('Unauthorized'));
		}

		const invoiceName = `invoice-${ orderId }.pdf`;
		const invoicePath = path.join('data', 'invoices', invoiceName);

		const pdfDocument = new PDFDocument();

		response.setHeader('Content-Type', 'application/pdf');
		response.setHeader('Content-Disposition', `inline; filename="${ invoiceName }"`);

		pdfDocument.pipe(fs.createWriteStream(invoicePath));
		pdfDocument.pipe(response);

		pdfDocument.fontSize(26).text('Invoice', { underline: true });

		pdfDocument.text('------------');

		let totalPrice = 0;

		order.products.forEach(({ product, quantity, p }) => {
			totalPrice += quantity * product.price;

			pdfDocument.fontSize(14).text(`${ product.title } - ${ quantity } x $${ product.price }`);
		});

		pdfDocument.text('---');

		pdfDocument.fontSize(20).text(`Total price: $${ totalPrice }`);

		pdfDocument.end();
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(error);
	})
};