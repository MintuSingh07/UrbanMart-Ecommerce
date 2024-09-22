const express = require('express');
const Product = require('../models/product.model');
const User = require('../models/user.model');

const homeController = async (req, res) => {
    const { userId } = req.body;

    try {
        const allProducts = await Product.find();

        if (!allProducts.length) {
            return res.json({ message: "No products to show" });
        }

        const user = await User.findById(userId).populate({
            path: 'actions',
            select: 'category',
        });

        let categories = user.actions.map(action => action.category);

        categories = categories.sort(() => Math.random() - 0.5);

        const recommendedProducts = [];

        for (const category of categories) {
            const products = await Product.find({ category }).limit(5);

            if (products.length) {
                recommendedProducts.push(products.sort(() => Math.random() - 0.5)[0]);
            }

            if (recommendedProducts.length === 5) {
                break;
            }
        }

        res.status(200).json({ allProducts, recommendedProducts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

// const homeController = async (req, res) => {
//     const { userId } = req.body;

//     try {
//         const allProducts = await Product.find();

//         if (!allProducts.length) {
//             return res.json({ message: "No products to show" });
//         }

//         const user = await User.findById(userId).populate({
//             path: 'actions',
//             select: 'category',
//         });

//         let categories = user.actions.map(action => action.category);

//         // Shuffle the categories array
//         categories = [...new Set(categories)].sort(() => Math.random() - 0.5);

//         const recommendedProducts = new Set();

//         for (const category of categories) {
//             const products = await Product.find({ category });

//             // Shuffle the products array and add the first one to recommendedProducts
//             if (products.length) {
//                 products.sort(() => Math.random() - 0.5).forEach(product => {
//                     if (recommendedProducts.size < 5) {
//                         recommendedProducts.add(product);
//                     }
//                 });
//             }

//             // Stop when you have 5 recommended products
//             if (recommendedProducts.size === 5) {
//                 break;
//             }
//         }

//         res.status(200).json({ allProducts, recommendedProducts: Array.from(recommendedProducts) });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching products', error });
//     }
// };

const singleProductController = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const relatedProducts = await Product.find({ category: product.category });
        if (!relatedProducts) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (userId) {
            await User.findByIdAndUpdate(userId, { $addToSet: { actions: product._id } }, { new: true });
        }

        return res.status(200).json({ product, relatedProducts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
};

const wishlistController = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId).populate('wishList');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ "wishlistItems": user.wishList });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const addToWishlistController = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishList: productId } },
            { new: true }
        ).populate('wishList');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: "Item added to wishlist !!!" });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const deleteFromWishlistController = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { wishList: productId } },
            { new: true }
        ).populate('wishList');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: "Item deleted from wishlist !!!" });
    } catch (error) {
        console.error('Error deleting from wishlist:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const getNotificationsController = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        res.json({"Notifications": user.notifications})
    } catch (error) {
        res.json({ "Error": error });
    }
}


module.exports = {
    homeController,
    singleProductController,
    wishlistController,
    addToWishlistController,
    deleteFromWishlistController,
    getNotificationsController,
};
