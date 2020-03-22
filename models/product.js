const Cart = require('./cart');
const database = require('../util/database');

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		const { title, price, imageUrl, description } = this;

		return database.execute(
			'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
			[title, price, imageUrl, description],
		);
	}

	static fetchAll() {
		return database.execute('SELECT * FROM products');
	}

	static findById(id) {
		return database.execute('SELECT * FROM products WHERE products.id = ?', [id]);
	}

	static deleteById(id) {
	}
};