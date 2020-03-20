const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const productsPath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = (callback) => {
	fs.readFile(productsPath, (error, fileContent) => {
		if (error) {
			callback([]);
		}

		callback(JSON.parse(fileContent));
	});
};

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		getProductsFromFile((products) => {
			if (this.id) {
				const existingProductIndex = products.findIndex((prod) => prod.id === this.id);
				const updatedProduct = [...products];

				updatedProduct[existingProductIndex] = this;

				fs.writeFile(productsPath, JSON.stringify(updatedProduct), (error) => {
					console.log(error);
				});
			} else {
				this.id = Math.random().toString();

				products.push(this);

				fs.writeFile(productsPath, JSON.stringify(products), (error) => {
					console.log(error);
				});
			}
		});
	}

	static fetchAll(callback) {
		getProductsFromFile(callback);
	}

	static findById(id, callback) {
		getProductsFromFile((products) => {
			const product = products.find((product) => product.id === id);

			callback(product);
		});
	}

	static deleteById(id) {
		getProductsFromFile((products) => {
			const product = products.find((product) => product.id === id);
			const updatedProducts = products.filter((product) => product.id !== id);

			fs.writeFile(productsPath, JSON.stringify(updatedProducts), (error) => {
				if (!error) {
					Cart.deleteProduct(id, product.price);
				}
			});
		});
	}
};