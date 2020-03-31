const mongodb = require('mongodb');
const { getDataBase } = require('../util/database');

class Product {
	constructor(title, price, description, imageUrl, id) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this._id = mongodb.ObjectId(id);
	}

	save() {
		const database = getDataBase();
		let operation;

		if (this._id) {
			operation = database.collection('products').updateOne({ _id: this._id }, { $set: this });
		} else {
			operation = database.collection('products').insertOne(this);
		}

		return operation
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