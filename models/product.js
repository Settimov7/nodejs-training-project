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
	constructor(title) {
		this.title = title;
	}

	save() {
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