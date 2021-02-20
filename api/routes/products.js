const express = require('express');
const checkAuth = require('../middlewares/check-auth');
const ProductsController = require('../controllers/products');

const router = express.Router();

// Get all products
router.get('/', ProductsController.get_all_products);

// Search products
router.get('/search', ProductsController.search_products);

// Get product
router.get('/:productId', ProductsController.get_product);

// Create product
router.post('/', checkAuth, ProductsController.create_product);

// Edit product
router.patch('/:productId', checkAuth, ProductsController.edit_product);

// Delete product(s)
router.delete('/:productId', checkAuth, ProductsController.delete_product);

module.exports = router;
