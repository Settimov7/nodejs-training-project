const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
	User.findById('5e836c811c9d440000a05cb2')
	.then((user) => {
		const { name, email, cart, _id } = user;

		request.user = new User(name, email, cart, _id);

		next();
	})
	.catch((error) => console.log(error));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

mongoose.connect('mongodb+srv://prytkov:N6BhxHED5lM0qM2A@cluster0-pui26.mongodb.net/test?retryWrites=true&w=majority')
.then(() => {
	app.listen(3000);
})
.catch((error) => console.log(error));
