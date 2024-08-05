const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    wishList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    profilePicture: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    actions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    tradeItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TradeItem' // Reference to TradeItem model
    }]
});

userSchema.index({ 'tradeItems.location': '2dsphere' }); // Index for geospatial queries

module.exports = mongoose.model('User', userSchema);
