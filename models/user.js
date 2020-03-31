const { ObjectId } = require('mongodb');
const { getDataBase } = require('../util/database');

class User {
	constructor(username, email, id) {
		this.name = username;
		this.email = email;
		this._id = ObjectId(id);
	}

	save() {
		const database = getDataBase();

		return database.collection('users').insertOne(this)
		.then((result) => {
			console.log(result);
		})
		.catch((error) => console.log(error));
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