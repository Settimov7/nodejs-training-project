const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

const mongoConnect = (callback) => {
	MongoClient.connect('mongodb+srv://prytkov:N6BhxHED5lM0qM2A@cluster0-pui26.mongodb.net/test?retryWrites=true&w=majority')
	.then((client) => {
		console.log('Connected!');

		database = client.db();

		callback(client);
	})
	.catch((error) => {
		console.log(error);

		throw error;
	});
};

const getDataBase = () => {
	if(database) {
		return database;
	}

	throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDataBase = getDataBase;