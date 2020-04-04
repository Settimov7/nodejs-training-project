const Product = require('../models/product');

exports.getAddProduct = (request, response) => {
	const isAuthenticated = request.session.isLoggedIn;

	response.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		isAuthenticated,
	});
};

exports.postAddProduct = (request, response) => {
	const { title, imageUrl, description, price } = request.body;
	const user = request.user;
	const product = new Product({ title, price, description, imageUrl, userId: user });

	product.save().then(() => {
		response.redirect('/admin/products');
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
	.then((product) => {

		if (!product) {
			return response.redirect('/');
		}

		const isAuthenticated = request.session.isLoggedIn;

		response.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: !!editMode,
			product,
			isAuthenticated,
		});
	})
	.catch((error) => console.log(error));
};

exports.postEditProduct = (request, response) => {
	const { productId, title, price, description, imageUrl } = request.body;

	Product.findById(productId)
	.then((product) => {
		product.title = title;
		product.price = price;
		product.description = description;
		product.imageUrl = imageUrl;

		return product.save();
	})
	.then(() => {
		response.redirect('/admin/products');
	})
	.catch((error) => console.log(error));
};

exports.getProducts = (request, response) => {
	const isAuthenticated = request.session.isLoggedIn;

	Product.find()
	// .select('title price -_id')
	// .populate('userId', 'name')
	.then((products) => {
		response.render('admin/products', {
			pageTitle: 'Admin Products',
			path: '/admin/products',
			prods: products,
			isAuthenticated,
		});
	})
	.catch((error) => console.log(error));
};

exports.postDeleteProduct = (request, response) => {
	const { productId } = request.body;

	Product.findByIdAndRemove(productId)
	.then(() => {
		response.redirect('/admin/products');
	})
	.catch((error) => console.log(error));
};