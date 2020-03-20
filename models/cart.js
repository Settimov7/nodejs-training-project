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

	static deleteProduct(id, price) {
		fs.readFile(cartPath, (error, fileContent) => {
			if (error) {
				return;
			}

			const updatedCart = { ...JSON.parse(fileContent) };
			const product = updatedCart.products.find((product) => product.id === id);

			if (product) {
				updatedCart.products = updatedCart.products.filter((product) => product.id !== id);
				updatedCart.totalPrice = updatedCart.totalPrice - price * product.quantity;

				fs.writeFile(cartPath, JSON.stringify(updatedCart), (error) => {
					console.log(error);
				});
			}
		});
	}

	static getProducts(callback) {
		fs.readFile(cartPath, (error, fileContent) => {
			const cart = JSON.parse(fileContent);

			if (error) {
				callback(null)
			} else {
				callback(cart);
			}
		});
	}
};