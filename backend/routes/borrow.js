const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const borrowControllers = require('../controllers/borrowController');

//一覧取得
router.get('/',asyncHandler(borrowControllers.getBorrowing));

//貸出登録
router.post('/',asyncHandler(borrowControllers.postBorrowing));

//削除(DELETE)
router.delete('/:id',asyncHandler(borrowControllers.deleteBorrowing));

module.exports = router;