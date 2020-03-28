const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
	MongoClient.connect('mongodb+srv://prytkov:N6BhxHED5lM0qM2A@cluster0-pui26.mongodb.net/test?retryWrites=true&w=majority')
	.then((client) => {
		console.log('Connected!');

		callback(client);
	})
	.catch((error) => console.log(error));
};

module.exports = mongoConnect;