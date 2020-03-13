const express = require('express');

const adminData = require('../routes/admin');

const router = express.Router();

router.get('/', (request, response) => {
	const products = adminData.products;

	response.render('shop', { prods: products, pageTitle: 'Shop', path: '/', hasProducts: products.length > 0, activeShop: true, productCss: true });
});

module.exports = router;
