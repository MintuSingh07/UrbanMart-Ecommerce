const express = require('express');
const router = new express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { getSelfTradesController, requestTrade } = require('../controllers/tradeController');

router.use(verifyToken);

router.post('/my-trades', getSelfTradesController);
router.post('/request-trade', requestTrade);

module.exports = router;
