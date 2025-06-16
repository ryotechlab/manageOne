const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const deviceController = require('../controllers/deviceController');

//GET /api/device → 一覧を取得
router.get('/', asyncHandler(deviceController.getDevices));

//POST /api/device → 機器を登録
router.post('/', asyncHandler(deviceController.createDevice));

module.exports = router;