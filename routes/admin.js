const express = require('express');

const adminController = require('../controllers/admin');
const iAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/products', iAuth, adminController.getProducts);

router.get('/add-product', iAuth, adminController.getAddProduct);

router.post('/add-product', iAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', iAuth, adminController.getEditProduct);

router.post('/edit-product', iAuth, adminController.postEditProduct);

router.post('/delete-product', iAuth, adminController.postDeleteProduct);

module.exports = router;
