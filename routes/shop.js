const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('../routes/admin');

const router = express.Router();

router.get('/', (request, response) => {
	const products = adminData.products;

	response.render('shop', { prods: products, docTitle: 'Shop' });
});

module.exports = router;