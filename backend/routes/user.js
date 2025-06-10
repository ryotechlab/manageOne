const express = require('express');
const router = express.Router();
const db = require('../../db/database');

const isEmpty = value => value === null || typeof value !== 'string' || value.trim() === '';

//GET /api/users → 全ユーザー取得
router.get('/', (req,res) => {
  try{
    const users = db.getAllUsers();
    res.status(200).json(users);
  }catch(err){
    res.status(err.status || 500).json(err.message || '内部エラー' );
  }
});

//POST /api/users → ユーザー登録
router.post('/', (req,res) => {
  try{
    const { name } = req.body;

    if(isEmpty(name)){
      return res.status(400).json({ message: '正しく入力して下さい' });
    }
    const result = db.postUsers(name);
    res.status(201).json(result);
  }catch(err){
    res.status(err.status || 500).json(err.message || '内部エラー' );
  }
});

module.exports = router;