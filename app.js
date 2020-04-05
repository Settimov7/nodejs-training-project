const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const createMongodbStore = require('connect-mongodb-session');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorsController = require('./controllers/errors');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://prytkov:N6BhxHED5lM0qM2A@cluster0-pui26.mongodb.net/shop';

const app = express();
const MongodbStore = createMongodbStore(session);
const store = new MongodbStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
	extended: false,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'my secret',
	resave: false,
	saveUninitialized: false,
	store,
}));

app.use((request, response, next) => {
	if (!request.session.user) {
		return next();
	}

	User.findById(request.session.user._id)
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

mongoose.connect(MONGODB_URI)
.then(() => {
	app.listen(3000);
})
.catch((error) => console.log(error));
