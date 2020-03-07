const path = require('path');

const express = require('express');

const router = express.Router();

router.get('/add-product', (request, response) => {
	response.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

router.post('/add-product', (request, response) => {
	response.redirect('/');
});

module.exports = router;