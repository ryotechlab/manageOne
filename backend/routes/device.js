const express = require('express');
const router = express.Router();
const { getAllDevices, postDevices } = require('../../db/database');

const isEmpty = value => value === null || typeof value !== 'string' || value.trim() === '';

//GET /api/device → 一覧を取得
router.get('/', (req,res) => {
  getAllDevices((err,rows) => {
    if(err){
      res.status(500).json({ error: 'DBエラー' });
    }else{
      res.status(200).json(rows);
    }
  });
});

//POST /api/device → 機器を登録
router.post('/', (req,res) => {
  const deviceName = req.body.name;

  if(isEmpty(deviceName)){
    return res.status(400).json({ message: '正しく入力して下さい' });
  }

  postDevices(deviceName, (err,rows) => {
    if (err) {
      return res.status(err.status).json({ error: err.message });
    }
    
    res.status(201).json({ id: rows.id });
  });
});

module.exports = router;