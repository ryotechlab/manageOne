const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const asyncHandler = require('../../utils/asyncHandler');

const isEmpty = value => value === null || typeof value !== 'string' || value.trim() === '';

//GET /api/users → 全ユーザー取得
router.get('/', asyncHandler((req,res) => {
  const users = db.getAllUsers();
  res.status(200).json(users);
}));

//POST /api/users → ユーザー登録
router.post('/', asyncHandler((req,res) => {
  const { name } = req.body;

  if(isEmpty(name)){
    return res.status(400).json({ message: '正しく入力して下さい' });
  }
  const result = db.postUsers(name);
  res.status(201).json(result);
}));

module.exports = router;