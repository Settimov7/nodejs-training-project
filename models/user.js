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
		// const cartProduct = this.cart.items.find((item)=> item._id === product._id);
		const updatedCart = {
			items: [
				{
					productId: new ObjectId(product._id),
					quantity: 1
				},
			],
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