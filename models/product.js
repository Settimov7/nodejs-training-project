const mongodb =  require('mongodb');
const { getDataBase } = require('../util/database');

class Product {
	constructor(title, price, description, imageUrl) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
	}

	save() {
		const database = getDataBase();

		return database
		.collection('products')
		.insertOne(this)
		.then((result) => console.log(result))
		.catch((error) => console.log(error));
	}

	static fetchAll() {
		const database = getDataBase();

		return database
		.collection('products')
		.find()
		.toArray()
		.then((products) => {
			console.log(products);

			return products;
		})
		.catch((error) => console.log(error));
	}

	static findById(id) {
		const database = getDataBase();

		return database
		.collection('products')
		.find({ _id: mongodb.ObjectId(id) })
		.next()
		.then((product) => {
			console.log(product);

			return product;
		})
		.catch((error) => console.log(error));
	}
}

module.exports = Product;