const express = require('express');
const fs = require('fs');
const path = require('path');
const { db, getAllBorrows, postBorrows, deleteBorrow} = require('../../db/database');

const router = express.Router();

//一覧取得
router.get('/',(req,res) => {
  getAllBorrows((err, rows) => {
    if(err){
      res.status(500).json({ err: 'データベースエラー' });
    }else{
      res.status(200).json(rows);
    }
  });
});

//貸出登録
router.post('/',(req,res) => {
  const { deviceName, userName, date} = req.body;

  if(!deviceName || !userName || !date){
    return res.status(400).json({ message: '全ての項目を入力して下さい' });
  }

  postBorrows(deviceName, userName, date, (err, result) => {
    if (err) {
      return res.status(err.status).json({ error: err.message });
    }
    
    res.status(201).json({ id: result.id });
  });
});

//削除(DELETE)
router.delete('/:id',(req,res) => {
  const id = req.params.id;
  deleteBorrow(id, (err) => {
    if(err){
      return res.status(err.status).json({ err: err.massage });
    }
    res.status(200).json({ message: '削除に成功しました' });
  });
});

module.exports = router;