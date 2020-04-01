const { ObjectId } = require('mongodb');
const { getDataBase } = require('../util/database');

class User {
	constructor(username, email, cart, id) {
		this.name = username;
		this.email = email;
		this.cart = cart;
		this._id = id;
	}

	save() {
		const database = getDataBase();

		return database.collection('users').insertOne(this)
		.then((result) => {
			console.log(result);
		})
		.catch((error) => console.log(error));
	}

	addToCard(product) {
		const database = getDataBase();
		const cartProductIndex = this.cart.items.findIndex((item)=> item.productId.toString() === product._id.toString());
		let newQuantity = 1;
		const updatedCartItems = [...this.cart.items];

		if(cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		} else {
			updatedCartItems.push({
				productId: new ObjectId(product._id),
				quantity: newQuantity
			});
		}

		const updatedCart = {
			items: updatedCartItems,
		};

		return database.collection('users').updateOne(
			{
				_id: new ObjectId(this._id)
			},
			{
				$set: { cart: updatedCart }
			},
		);
	}

	static findById(id) {
		const database = getDataBase();

		return database
		.collection('users')
		.findOne({ _id: ObjectId(id) })
		.then((user) => {
			console.log(user);

			return user;
		})
		.catch((error) => console.log(error));
	}
}

module.exports = User;