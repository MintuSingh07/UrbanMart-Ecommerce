const mongoose = require('mongoose');

const tradeItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: function (v) {
                    return v.length === 2; // Ensure coordinates have exactly 2 elements
                },
                message: 'Coordinates must have exactly 2 elements.'
            }
        }
    },
});

tradeItemSchema.index({ location: '2dsphere' }); // Index for geospatial queries

module.exports = mongoose.model('TradeItem', tradeItemSchema);
