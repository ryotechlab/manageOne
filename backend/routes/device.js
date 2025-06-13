const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const asyncHandler = require('../../utils/asyncHandler');

const isEmpty = value => value === null || typeof value !== 'string' || value.trim() === '';

//GET /api/device → 一覧を取得
router.get('/', asyncHandler((req,res) => {
  const devices = db.getAllDevices();
  res.status(200).json(devices);
}));

//POST /api/device → 機器を登録
router.post('/', asyncHandler((req,res) => {
  const { name } = req.body;

  if(isEmpty(name)){
  return res.status(400).json({ message: '正しく入力して下さい' });
  }

  const result = db.postDevices(name);
  res.status(201).json(result);
}));

module.exports = router;