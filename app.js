const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorsController = require('./controllers/errors');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
	User.findById('5e8826dee499c7011c520f15')
	.then((user) => {
		request.user = user;

		next();
	})
	.catch((error) => console.log(error));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404);

mongoose.connect('mongodb+srv://prytkov:N6BhxHED5lM0qM2A@cluster0-pui26.mongodb.net/shop?retryWrites=true&w=majority')
.then(() => {
	User.findOne().then((user) => {
		if (!user) {
			const user = new User({
				name: 'Name',
				email: 'name@mail.com',
				cart: {
					items: [],
				},
			});

			user.save();
		}
	});

	app.listen(3000);
})
.catch((error) => console.log(error));
