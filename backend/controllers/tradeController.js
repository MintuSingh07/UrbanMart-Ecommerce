const TradeItem = require('../models/tradeItem.model');
const User = require('../models/user.model');
const client = require('../client');

// Function to calculate distance between two geographic coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

// Function to get trades within a certain radius
const getTradesWithinRadius = async (latitude, longitude, radiusInKm) => {
    try {
        const allTrades = await TradeItem.find().populate('user', 'userName email');
        
        const tradesWithinRadius = allTrades.filter(trade => {
            if (!trade.location || !Array.isArray(trade.location.coordinates) || trade.location.coordinates.length !== 2) {
                console.warn(`Invalid trade location data for trade ${trade._id}:`, trade.location);
                return false;
            }

            const [tradeLongitude, tradeLatitude] = trade.location.coordinates;
            const distance = calculateDistance(latitude, longitude, tradeLatitude, tradeLongitude);
            return distance <= radiusInKm;
        });

        return tradesWithinRadius;
    } catch (error) {
        console.error('Error fetching trades within radius:', error);
        throw error;
    }
};

// Controller function to handle socket events related to trades
const handleSocketEvents = (socket) => {
    console.log('A user connected', socket.id);

    socket.on('locationUpdate', async (data) => {
        const { latitude, longitude } = data;
        console.log(`Received location update: Latitude ${latitude}, Longitude ${longitude}`);

        const radiusInKm = 10;

        try {
            const trades = await getTradesWithinRadius(latitude, longitude, radiusInKm);
            socket.emit('tradesWithinRadius', trades);
        } catch (error) {
            console.error('Error fetching trades within radius:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id);
    });
};

const getSelfTradesController = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        let selfTrades = await client.get('selftrades');

        if (selfTrades) {
            return res.json({ myItems: JSON.parse(selfTrades) });
        }

        const user = await User.findById(userId).populate('tradeItems', 'name description');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        selfTrades = user.tradeItems;
        await client.setex('selftrades', 100, JSON.stringify(selfTrades));

        res.json({ myItems: selfTrades });
    } catch (error) {
        console.error('Error fetching self trades:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const requestTrade = async (req, res) => {
    const { tradeItem, myTradeItem } = req.body;
    const userId = req.user.id;

    try {
        // Find the user who listed the trade item
        const tradeOwner = await User.findById(tradeItem.user._id);
        if (!tradeOwner) {
            return res.status(404).json({ message: 'Trade owner not found.' });
        }

        // Find the user's trade item
        const userTradeItem = await TradeItem.findById(myTradeItem._id);
        if (!userTradeItem) {
            return res.status(404).json({ message: 'Your trade item not found.' });
        }

        // Send the trade request
        tradeOwner.notifications.push({
            type: 'trade-request',
            message: `${req.user.userName} wants to trade ${myTradeItem.name} for your ${tradeItem.name}.`,
            tradeItem: tradeItem,
            myTradeItem: myTradeItem,
        });

        await tradeOwner.save();
        return res.status(200).json({ message: 'Trade request sent successfully.' });
    } catch (error) {
        console.error('Error handling trade request:', error);
        return res.status(500).json({ message: 'An error occurred while handling the trade request.' });
    }
};

const deleteNotification = async (req, res) => {
    const { notificationId, userId } = req.body;

    if (!notificationId) {
        return res.status(400).json({ error: 'Notification ID is required' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { notifications: { _id: notificationId } } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully', notifications: user.notifications });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { handleSocketEvents, getSelfTradesController, requestTrade, deleteNotification };
