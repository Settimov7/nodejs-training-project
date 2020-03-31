const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');
const { mongoConnect } = require('./util/database');
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

mongoConnect(() => {
	app.listen(3000);
});
