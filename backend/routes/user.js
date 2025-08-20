const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

//GET /api/users → 全ユーザー取得
router.get('/', asyncHandler(userController.getUsers));

//POST /api/users → ユーザー登録、パスワード登録
router.post('/', authMiddleware, asyncHandler(userController.createUser));

//POST /api/users/login
router.post('/login', asyncHandler(userController.login));

module.exports = router;