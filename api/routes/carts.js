const express = require('express');
const checkAuth = require('../middlewares/check-auth');
const CartsController = require('../controllers/carts');

const router = express.Router();

// Get all carts
router.get('/', checkAuth, CartsController.get_all_carts);

// Delete user
router.delete('/:cartId', checkAuth, CartsController.delete_cart);

module.exports = router;