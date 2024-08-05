const express = require('express');
const router = new express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { getSelfTradesController } = require('../controllers/tradeController');

router.use(verifyToken);

router.post('/my-trades', getSelfTradesController);

module.exports = router;
