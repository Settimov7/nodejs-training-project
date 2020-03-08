const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('../routes/admin');

const router = express.Router();

router.get('/', (request, response) => {
	console.log(adminData.products);
	response.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;