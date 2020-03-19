const Product = require('../models/product');

exports.getAddProduct = (request, response) => {
	response.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.postAddProduct = (request, response) => {
	const { title, imageUrl, description, price } = request.body;
	const product = new Product(title, imageUrl, description, price);

	product.save();

	response.redirect('/');
};

exports.getEditProduct = (request, response) => {
	const editMode = request.query.edit;

	if(!editMode) {
		return response.redirect('/');
	}

	const { productId } = request.params;

	Product.findById(productId, (product) => {
		if(!product) {
			return response.redirect('/');
		}

		response.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: !!editMode,
			product,
		});
	});
};

exports.postEditProduct = (request, response) => {
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