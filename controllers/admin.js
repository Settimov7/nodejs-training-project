const Product = require('../models/product');

exports.getAddProduct = (request, response) => {
	response.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.postAddProduct = (request) => {
	const { title, imageUrl, description, price } = request.body;

	Product.create({ title, price, imageUrl, description })
	.then(() => {
	})
	.catch((error) => console.log(error));
};

exports.getEditProduct = (request, response) => {
	const editMode = request.query.edit;

	if (!editMode) {
		return response.redirect('/');
	}

	const { productId } = request.params;

	Product.findById(productId)
	.then(([product]) => {
		if (!product) {
			return response.redirect('/');
		}

		response.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: !!editMode,
			product,
		});
	})
	.catch((error) => console.log(error));
};

exports.postEditProduct = (request, response) => {
	const { productId, title, imageUrl, description, price } = request.body;
	const updatedProduct = new Product(productId, title, imageUrl, description, price);

	updatedProduct.save();

	response.redirect('/admin/products');
};

exports.getProducts = (request, response) => {
	Product.findAll()
	.then((products) => {
		response.render('admin/products', {
			pageTitle: 'Admin Products',
			path: '/admin/products',
			prods: products
		});
	})
	.catch((error) => console.log(error));
};

exports.postDeleteProduct = (request, response) => {
	const { productId } = request.body;

	Product.deleteById(productId);

	response.redirect('/admin/products');
};