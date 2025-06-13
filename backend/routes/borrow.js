const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const asyncHandler = require('../../utils/asyncHandler');

//空・スペースのみを検査
const isEmpty = value => typeof value !== 'string' || value.trim() === '';

//一覧取得
router.get('/',asyncHandler((req,res) => {
  const borrows = db.getAllBorrows();
  res.status(200).json(borrows);
}));

//貸出登録
router.post('/',asyncHandler((req,res) => {
  const { deviceName, userName, date} = req.body;

  if([deviceName, userName, date].some(isEmpty)){
    return res.status(400).json({ message: '全ての項目を正しく選択・入力して下さい' });
  }

  const result = db.postBorrows(deviceName, userName, date);
  res.status(201).json(result);
}));

//削除(DELETE)
router.delete('/:id',asyncHandler((req,res) => {
  db.deleteBorrow(Number(req.params.id));
  res.status(204).end();
}));

module.exports = router;