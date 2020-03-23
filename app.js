const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorsController = require('./controllers/errors');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
	User.findByPk(1)
	.then((user) => {
		request.user = user;

		next();
	})
	.catch((error) => console.log(error));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

Product.belongsTo(User, {
	constraints: true,
	onDelete: 'CASCADE',
});

User.hasMany(Product);
User.hasOne(Cart);

Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize.sync({ force: true })
.then(() => User.findByPk(1))
.then((user) => {
	if (!user) {
		return User.create({ name: 'Name', email: 'test@test.com' })
	}

	return user;
})
.then(() => {
	app.listen(3000);
})
.catch((error) => console.log(error));
