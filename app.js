const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.engine('hbs', expressHandlebars({
	layoutsDir: 'views/layouts/',
	defaultLayout: 'main-layout',
	extname: 'hbs',
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRouter);

app.use((request, response) => {
	response.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(3000);
