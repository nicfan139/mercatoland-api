const express = require('express');
const checkAuth = require('../middlewares/check-auth');
const UsersController = require('../controllers/users');
const UsersCartsController = require('../controllers/usersCarts');
const UsersReceiptsController = require('../controllers/usersReceipts');

const router = express.Router();

// Get all users
router.get('/', checkAuth, UsersController.get_all_users);

// Get user
router.get('/:userId', checkAuth, UsersController.get_user);

// Create/register new user
router.post('/register', UsersController.register_new_user);

// User login
router.post('/login', UsersController.authenticate_user);

// Edit user
router.put('/:userId', checkAuth, UsersController.edit_user);

// Delete user
router.delete('/:userId', checkAuth, UsersController.delete_user);

// Get user cart
router.get('/:userId/cart', UsersCartsController.get_user_cart);

// Add cart to user
router.post('/:userId/cart', UsersCartsController.add_user_cart);

// Edit user's cart
router.put('/:userId/cart', UsersCartsController.edit_user_cart);

// Get user's receipts
router.get('/:userId/receipts', UsersReceiptsController.get_user_receipts);

module.exports = router;