const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../../db/database');

const router = express.Router();

//空・スペースのみを検査
const isEmpty = value => typeof value !== 'string' || value.trim() === '';

//一覧取得
router.get('/',(req,res) => {
  try{
    const borrows = db.getAllBorrows();
    res.status(200).json(borrows);
  }catch(err){
    res.status(err.status || 500).json({ error: err.message || '内部エラー' });
  }
});

//貸出登録
router.post('/',(req,res) => {
  try{
    const { deviceName, userName, date} = req.body;

    if([deviceName, userName, date].some(isEmpty)){
      return res.status(400).json({ message: '全ての項目を正しく選択・入力して下さい' });
    }

    const result = db.postBorrows(deviceName, userName, date);
    res.status(201).json(result);
  }catch(err){
    res.status(err.status || 500).json({ error: err.message || '内部エラー' });
  }
});

//削除(DELETE)
router.delete('/:id',(req,res) => {
  try{
    db.deleteBorrow(Number(req.params.id));
    res.status(204).end();
  }catch(err){
    res.status(err.status || 500).json({ error: err.message || '内部エラー' });
  }
});

module.exports = router;