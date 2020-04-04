const { Schema, model } = require('mongoose');

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				}
			},
		],
	},
});

module.exports = model('User', userSchema);

// const { ObjectId } = require('mongodb');
// const { getDataBase } = require('../util/database');
//
// class User {
// 	constructor(username, email, cart, id) {
// 		this.name = username;
// 		this.email = email;
// 		this.cart = cart;
// 		this._id = id;
// 	}
//
// 	save() {
// 		const database = getDataBase();
//
// 		return database.collection('users').insertOne(this)
// 		.then((result) => {
// 			console.log(result);
// 		})
// 		.catch((error) => console.log(error));
// 	}
//
// 	addToCard(product) {
// 		const database = getDataBase();
// 		const cartProductIndex = this.cart.items.findIndex((item) => item.productId.toString() === product._id.toString());
// 		let newQuantity = 1;
// 		const updatedCartItems = [...this.cart.items];
//
// 		if (cartProductIndex >= 0) {
// 			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
// 			updatedCartItems[cartProductIndex].quantity = newQuantity;
// 		} else {
// 			updatedCartItems.push({
// 				productId: new ObjectId(product._id),
// 				quantity: newQuantity
// 			});
// 		}
//
// 		const updatedCart = {
// 			items: updatedCartItems,
// 		};
//
// 		return database.collection('users').updateOne(
// 			{
// 				_id: new ObjectId(this._id)
// 			},
// 			{
// 				$set: {
// 					cart: updatedCart
// 				},
// 			},
// 		);
// 	}
//
// 	getCart() {
// 		const database = getDataBase();
// 		const productIds = this.cart.items.map((item) => item.productId);
// 		return database
// 		.collection('products')
// 		.find({ _id: { $in: productIds } })
// 		.toArray()
// 		.then((products) => products.map((product) => ({
// 			...product,
// 			quantity: this.cart.items.find((item) => item.productId.toString() === product._id.toString()).quantity,
// 		})))
// 		.catch((error) => console.log(error));
// 	}
//
// 	deleteItemFromCart(productId) {
// 		const database = getDataBase();
// 		const updatedCartItems = this.cart.items.filter((item) => item.productId.toString() !== productId.toString());
//
// 		return database.collection('users').updateOne(
// 			{
// 				_id: new ObjectId(this._id)
// 			},
// 			{
// 				$set: {
// 					cart: {
// 						items: updatedCartItems
// 					},
// 				},
// 			},
// 		);
// 	}
//
// 	addOrder() {
// 		const database = getDataBase();
//
// 		return this.getCart()
// 		.then((products) => {
// 			const order = {
// 				items: products,
// 				user: {
// 					_id: new ObjectId(this._id),
// 					name: this.name,
// 				},
// 			};
//
// 			return database.collection('orders').insertOne(order);
// 		})
// 		.then(() => {
// 			this.cart = { items: [] };
//
// 			return database.collection('users').updateOne(
// 				{
// 					_id: new ObjectId(this._id)
// 				},
// 				{
// 					$set: {
// 						cart: {
// 							items: []
// 						},
// 					},
// 				},
// 			);
// 		})
// 		.catch((error) => console.log(error));
// 	}
//
// 	getOrders() {
// 		const database = getDataBase();
//
// 		return database
// 		.collection('orders')
// 		.find({'user._id': new ObjectId(this._id)})
// 		.toArray();
// 	}
//
// 	static findById(id) {
// 		const database = getDataBase();
//
// 		return database
// 		.collection('users')
// 		.findOne({ _id: ObjectId(id) })
// 		.then((user) => {
// 			console.log(user);
//
// 			return user;
// 		})
// 		.catch((error) => console.log(error));
// 	}
// }
//
// module.exports = User;