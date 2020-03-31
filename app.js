const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');
const { mongoConnect } = require('./util/database');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
	// User.findByPk(1)
	// .then((user) => {
	// 	request.user = user;
	//
	// 	next();
	// })
	// .catch((error) => console.log(error));
	next();
});
//
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

mongoConnect(() => {
	app.listen(3000);
});
