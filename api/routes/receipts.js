const express = require('express');
const checkAuth = require('../middlewares/check-auth');
const ReceiptsController = require('../controllers/receipts');

const router = express.Router();

// Get all receipts
router.get('/', checkAuth, ReceiptsController.get_all_receipts);

module.exports = router;
