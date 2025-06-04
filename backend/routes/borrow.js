const express = require('express');
const fs = require('fs');
const path = require('path');
const { db, getAllBorrows, deleteBorrow} = require('../../db/database');

const router = express.Router();

//ファイルからデータを読み込む関数
function readData(){
  const raw = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(raw);
}

//データをファイルに保存する関数
function writeData(data){
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

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

  const sql = 'INSERT INTO borrow (device_name, user_name, date) VALUES (?, ?, ?)';
  db.run(sql, [deviceName, userName, date], function(err){
    if(err){
      return res.status(500).json({ error: 'データベースへの登録に失敗しました' });
    }
    res.status(201).json({ message: '登録成功', id: this.lastID });
  });
});

//削除(DELETE)
router.delete('/:id',(req,res) => {
  const id = req.params.id;
  deleteBorrow(id, (err,changes) => {
    if(err){
      res.status(500).json({ err: '削除に失敗しました' });
    }else if(changes === 0){
      res.status(404).json({ message: '指定されたIDのデータが見つかりませんでした' });
    }else{
      res.status(201).json({ message: '削除に成功しました' });
    }
  });
});

module.exports = router;