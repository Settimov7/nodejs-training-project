const { validationResult } = require('express-validator/check');

const Product = require('../models/product');

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

exports.postAddProduct = (request, response) => {
	const { title, imageUrl, description, price } = request.body;
	const user = request.user;
	const product = new Product({ title, price, description, imageUrl, userId: user });
	const errors = validationResult(request);

	if(!errors.isEmpty()) {
		return response.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			hasError: true,
			product: {
				title,
				imageUrl,
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

exports.getEditProduct = (request, response) => {
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

exports.postEditProduct = (request, response) => {
	const { productId, title, price, description, imageUrl } = request.body;
	const errors = validationResult(request);

	if(!errors.isEmpty()) {
		return response.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: true,
			hasError: true,
			product: {
				title,
				imageUrl,
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
		product.imageUrl = imageUrl;

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

exports.getProducts = (request, response) => {
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

exports.postDeleteProduct = (request, response) => {
	const { productId } = request.body;

	Product.deleteOne({
		_id: productId,
		userId: request.user._id,
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