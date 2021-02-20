const express = require('express');
const checkAuth = require('../middlewares/check-auth');
const CartsController = require('../controllers/carts');

const router = express.Router();

// Get all carts
router.get('/', checkAuth, CartsController.get_all_carts);

// Checkout cart
router.post('/checkout', checkAuth, CartsController.checkout_cart);

// Delete cart
router.delete('/:cartId', checkAuth, CartsController.delete_cart);

module.exports = router;
