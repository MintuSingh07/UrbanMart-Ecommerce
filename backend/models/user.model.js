const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: { type: String, required: true },
    message: { type: String, required: true },
    tradeItem: { type: mongoose.Schema.Types.ObjectId, ref: 'TradeItem' },
    myTradeItem: { type: mongoose.Schema.Types.ObjectId, ref: 'TradeItem' },
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
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
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    },
    actions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    tradeItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TradeItem'
    }],
    notifications: [notificationSchema],
});

module.exports = mongoose.model('User', userSchema);
