const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const iAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/products', iAuth, adminController.getProducts);

router.get('/add-product', iAuth, adminController.getAddProduct);

router.post('/add-product',
	[
		body('title').isString().isLength({ min: 3 }).trim(),
		body('imageUrl').isURL(),
		body('price').isFloat(),
		body('title').isLength({ min: 5, max: 200 }).trim(),
	],
	iAuth,
	adminController.postAddProduct,
);

router.get('/edit-product/:productId', iAuth, adminController.getEditProduct);

router.post('/edit-product',
	[
		body('title').isString().isLength({ min: 3 }).trim(),
		body('imageUrl').isURL(),
		body('price').isFloat(),
		body('title').isLength({ min: 5, max: 200 }).trim(),
	],
	iAuth,
	adminController.postEditProduct,
);

router.post('/delete-product', iAuth, adminController.postDeleteProduct);

module.exports = router;
