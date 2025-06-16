const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const userController = require('../controllers/userController');

//GET /api/users → 全ユーザー取得
router.get('/', asyncHandler(userController.getUsers));

//POST /api/users → ユーザー登録
router.post('/', asyncHandler(userController.createUser));

module.exports = router;