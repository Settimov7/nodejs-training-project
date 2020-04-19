const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const createMongodbStore = require('connect-mongodb-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorsController = require('./controllers/errors');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-pui26.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const MongodbStore = createMongodbStore(session);
const store = new MongodbStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
	destination: (request, file, callback) => {
		callback(null, 'images');
	},
	filename: (request, file, callback) => {
		callback(null, `${ new Date().getMilliseconds().toString() }-${ file.originalname }`);
	},
});
const fileFilter = (request, file, callback) => {
	if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		callback(null, true);
	}

	callback(null, false);
};

app.set('view engine', 'ejs');

app.use(helmet());
app.use(compression());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', {
	stream: accessLogStream,
}));

app.use(bodyParser.urlencoded({
	extended: false,
}));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
	secret: 'my secret',
	resave: false,
	saveUninitialized: false,
	store,
}));
app.use(csrfProtection);
app.use(flash());

app.use((request, response, next) => {
	response.locals.isAuthenticated = request.session.isLoggedIn;
	response.locals.csrfToken = request.csrfToken();

	next();
});

app.use((request, response, next) => {
	if (!request.session.user) {
		return next();
	}

	User.findById(request.session.user._id)
	.then((user) => {
		if (!user) {
			return next();
		}

		request.user = user;

		next();
	})
	.catch((error) => {
		const productCreatingError = new Error(error);
		productCreatingError.httpStatusCode = 500;

		return next(productCreatingError);
	});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorsController.get500);
app.use(errorsController.get404);

app.use((error, request, response, next) => {
	response.status(500).render('500', {
		pageTitle: 'Error',
		path: '/500',
	});
})

mongoose.connect(MONGODB_URI)
.then(() => {
	app.listen(process.env.PORT || 3000);
})
.catch((error) => {
	const productCreatingError = new Error(error);
	productCreatingError.httpStatusCode = 500;

	return next(productCreatingError);
});
