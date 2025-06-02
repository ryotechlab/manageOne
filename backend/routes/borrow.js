const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const dataFilePath = path.join(__dirname,'..','..','db','borrow.json');

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
  const borrowData = readData();
  res.json(borrowData);
});

//貸出登録
router.post('/',(req,res) => {
  const { deviceName, userName, date} = req.body;

  if(!deviceName || !userName || !date){
    return res.status(400).json({ message: '全ての項目を入力して下さい' });
  }

  const borrowData = readData();

  const newEntry = {
    id: Date.now(),
    deviceName,
    userName,
    date
  };

  borrowData.push(newEntry);
  writeData(borrowData);

  res.status(201).json({ message: '登録完了'});
});

//削除(DELETE)
router.delete('/:id',(req,res) => {
  const borrowData = readData();
  const idToDelete = parseInt(req.params.id, 10);
  
  const updateData = borrowData.filter(entry => entry.id != idToDelete);

  if(borrowData.length === updateData.length){
    return res.status(404).json({ message: '対象のIDが見つかりません' });
  }

  writeData(updateData);
  res.status(200).json({ message: '削除しました' });

});

module.exports = router;