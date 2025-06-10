const express = require('express');
const router = express.Router();
const db = require('../../db/database');

const isEmpty = value => value === null || typeof value !== 'string' || value.trim() === '';

//GET /api/device → 一覧を取得
router.get('/', (req,res) => {
  try{
    const devices = db.getAllDevices();
    res.status(200).json(devices);
  }catch(err){
    res.status(err.status || 500).json({ error: err.message || '内部エラー' });
  }
});

//POST /api/device → 機器を登録
router.post('/', (req,res) => {
  try{
    const { name } = req.body;

    if(isEmpty(name)){
    return res.status(400).json({ message: '正しく入力して下さい' });
    }

    const result = db.postDevices(name);
    res.status(201).json(result);
  }catch(err){
    res.status(err.status || 500).json({ error: err.message || '内部エラー' });
  }
});

module.exports = router;