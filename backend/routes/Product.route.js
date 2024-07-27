const express = require('express');
const { 
    homeController, 
    singleProductController, 
    wishlistController, 
    addToWishlistController, 
    deleteFromWishlistController 
} = require('../controllers/productController');
const verifyToken = require('../middlewares/verifyToken');

const router = new express.Router();

// Apply verifyToken middleware only to specific routes
router.post('/', homeController);
router.post('/product/:id', singleProductController);

// Protect all other routes with verifyToken
router.use(verifyToken);

//! WISHLIST RELATED ROUTES
router.post('/wishlist', wishlistController);
router.post('/api/add-to-wishlist', addToWishlistController);
router.post('/api/delete-from-wishlist', deleteFromWishlistController);

module.exports = router;
