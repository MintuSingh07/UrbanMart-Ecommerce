const express = require('express');
const router = new express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { getSelfTradesController, requestTrade, deleteNotification } = require('../controllers/tradeController');

router.use(verifyToken);

router.post('/my-trades', getSelfTradesController);
router.post('/request-trade', requestTrade);
router.delete('/delete-notification', deleteNotification);

module.exports = router;
