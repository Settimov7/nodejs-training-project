const fs = require('fs');
const path = require('path');

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
	constructor(title, imageUrl, description, price) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		this.id = Math.random().toString();

		getProductsFromFile((products) => {
			products.push(this);

			fs.writeFile(productsPath, JSON.stringify(products), (error) => {
				console.log(error);
			});
		});
	}

	static fetchAll(callback) {
		getProductsFromFile(callback);
	}
};