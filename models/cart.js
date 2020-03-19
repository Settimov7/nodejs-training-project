const fs = require('fs');
const path = require('path');

const cartPath = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
	static addProduct(id, price) {
		fs.readFile(cartPath, (error, fileContent) => {
			let cart = { products: [], totalPrice: 0 };

			if (!error) {
				cart = JSON.parse(fileContent);
			}

			const existingProductId = cart.products.findIndex((product) => product.id === id);
			const existingProduct = cart.products[existingProductId];
			let updatedProduct;

			if (existingProduct) {
				updatedProduct = { ...existingProduct, quantity: existingProduct.quantity + 1 };
				cart.products = [...cart.products, updatedProduct];
				cart.products[existingProductId] = updatedProduct;
			} else {
				updatedProduct = { id: id, quantity: 1 };
				cart.products = [...cart.products, updatedProduct];
			}

			cart.totalPrice = cart.totalPrice + +price;

			fs.writeFile(cartPath, JSON.stringify(cart), (error) => {
				console.log(error);
			});
		});
	}
};