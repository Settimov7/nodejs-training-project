const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorsController = require('./controllers/errors');
const database = require('./util/database');

const app = express();

app.set('view engine', 'ejs');

database.execute('SELECT * FROM products')
	.then((result) => {})
	.catch((error) => {
		console.log(error);
	});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

app.listen(3000);
