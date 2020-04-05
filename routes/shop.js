const express = require('express');

const shopController = require('../controllers/shop');
const iAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', iAuth, shopController.getCart);

router.post('/cart', iAuth, shopController.postCart);

router.post('/cart-delete-item', iAuth, shopController.postCartDeleteProduct);

router.post('/create-order', iAuth, iAuth, shopController.postOrder);

router.get('/orders', iAuth, shopController.getOrders);

module.exports = router;
