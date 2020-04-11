const { validationResult } = require('express-validator/check');

const Product = require('../models/product');
const fileHelper = require('../util/file');

exports.getAddProduct = (request, response) => {
	response.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		hasError: false,
		errorMessage: null,
		validationErrors: [],
	});
};

exports.postAddProduct = (request, response, next) => {
	const { title, description, price } = request.body;
	const image = request.file;

	if (!image) {
		return response.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			hasError: true,
			product: {
				title,
				price,
				description,
			},
			errorMessage: 'Attached image is not an image',
			validationErrors: [],
		});
	}

	const imageUrl = image.path;

	const user = request.user;
	const product = new Product({ title, price, description, imageUrl, userId: user });
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		return response.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			hasError: true,
			product: {
				title,
				price,
				description,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	product.save().then(() => {
		response.redirect('/admin/products');
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.getEditProduct = (request, response, next) => {
	const editMode = request.query.edit;

	if (!editMode) {
		return response.redirect('/');
	}

	const { productId } = request.params;

	Product.findById(productId)
	.then((product) => {

		if (!product) {
			return response.redirect('/');
		}

		response.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: !!editMode,
			hasError: false,
			product,
			errorMessage: null,
			validationErrors: [],
		});
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.postEditProduct = (request, response, next) => {
	const { productId, title, price, description } = request.body;
	const image = request.file;
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		return response.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: true,
			hasError: true,
			product: {
				title,
				price,
				description,
				_id: productId,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	Product.findById(productId)
	.then((product) => {
		if (product.userId.toString() !== request.user._id.toString()) {
			return response.redirect('/');
		}

		product.title = title;
		product.price = price;
		product.description = description;

		if (image) {
			fileHelper.deleteFile(product.imageUrl);

			product.imageUrl = image.path;
		}

		return product.save()
		.then(() => {
			response.redirect('/admin/products');
		});
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.getProducts = (request, response, next) => {
	Product.find({ userId: request.user._id })
	// .select('title price -_id')
	// .populate('userId', 'name')
	.then((products) => {
		response.render('admin/products', {
			pageTitle: 'Admin Products',
			path: '/admin/products',
			prods: products,
		});
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};

exports.postDeleteProduct = (request, response, next) => {
	const { productId } = request.body;

	Product.findById(productId)
	.then((product) => {
		if (!product) {
			next(new Error('Product not found'));
		}

		fileHelper.deleteFile(product.imageUrl);

		return Product.deleteOne({
			_id: productId,
			userId: request.user._id,
		})
	})
	.then(() => {
		response.redirect('/admin/products');
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
};