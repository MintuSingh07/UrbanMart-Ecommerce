const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    images: {
        type: [String],
        validate: [arrayLimit, 'Exceeds the limit of 10 images']
    },
    isOutOfStock: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Home', 'Books', 'Toys'], // Example categories
    }
}, {
    timestamps: true
});

function arrayLimit(val) {
    return val.length <= 10;
}

module.exports = mongoose.model('Product', productSchema);
