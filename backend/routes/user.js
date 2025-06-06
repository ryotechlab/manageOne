const express = require('express');
const router = express.Router();
const { getAllUsers, postUsers } = require('../../db/database');

const isEmpty = value => value === null || typeof value !== 'string' || value.trim() === '';

//GET /api/users → 全ユーザー取得
router.get('/', (req,res) => {
  getAllUsers((err,rows) => {
    if(err){
      res.status(500).json({ err: 'DBエラー' });
    }else{
      res.status(200).json(rows);
    }
  });
});

//POST /api/users → ユーザー登録
router.post('/', (req,res) => {
  const userName = req.body.name;

  if(isEmpty(userName)){
    return res.status(400).json({ message: '正しく入力して下さい' });
  }

  postUsers(userName, (err,rows) => {
    if (err) {
      return res.status(err.status).json({ error: err.message });
    }
    
    res.status(201).json({ id: rows.id });
  });
});

module.exports = router;