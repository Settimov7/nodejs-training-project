const { Schema, model } = require('mongoose');

const productSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}
});

module.exports = model('Product', productSchema);



// const { ObjectId } = require('mongodb');
// const { getDataBase } = require('../util/database');
//
// class Product {
// 	constructor(title, price, description, imageUrl, id, userId) {
// 		this.title = title;
// 		this.price = price;
// 		this.description = description;
// 		this.imageUrl = imageUrl;
// 		this._id = id ? ObjectId(id) : null;
// 		this.userId = userId;
// 	}
//
// 	save() {
// 		const database = getDataBase();
// 		let operation;
//
// 		if (this._id) {
// 			operation = database.collection('products').updateOne({ _id: this._id }, { $set: this });
// 		} else {
// 			operation = database.collection('products').insertOne(this);
// 		}
//
// 		return operation
// 		.then((result) => console.log(result))
// 		.catch((error) => console.log(error));
// 	}
//
// 	static fetchAll() {
// 		const database = getDataBase();
//
// 		return database
// 		.collection('products')
// 		.find()
// 		.toArray()
// 		.then((products) => {
// 			console.log(products);
//
// 			return products;
// 		})
// 		.catch((error) => console.log(error));
// 	}
//
// 	static findById(id) {
// 		const database = getDataBase();
//
// 		return database
// 		.collection('products')
// 		.find({ _id: ObjectId(id) })
// 		.next()
// 		.then((product) => {
// 			console.log(product);
//
// 			return product;
// 		})
// 		.catch((error) => console.log(error));
// 	}
//
// 	static deleteById(id) {
// 		const database = getDataBase();
//
// 		return database
// 		.collection('products')
// 		.deleteOne({_id: ObjectId(id) })
// 		.then(() => {
// 			console.log('Deleted');
// 		})
// 		.catch((error) => console.log(error));
// 	}
// }
//
// module.exports = Product;