const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataFilePath = path.join(__dirname, '..', '..', 'db', 'return.json');

//読込み関数
function readData(){
  const raw = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(raw);
}

//書込み関数
function writeData(data){
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

//一覧取得
router.get('/', (req,res) => {
  const returnData = readData();
  res.json(returnData);
});

//返却登録(返却API)
router.post('/',(req,res) => {
  const { deviceName, userName, date } = req.body;

  if(!deviceName || !userName || !date){
    return res.status(400).json({ message: '全ての項目を入力して下さい' });
  }

  const returnData = readData();

  const newEntry = {
    id: Date.now(),
    deviceName,
    userName,
    date
  };

  returnData.push(newEntry);
  writeData(returnData);

  res.status(201).json(newEntry);
});

//削除(ID指定)
router.delete('/:id', (req,res) => {
  const returnData = readData();
  const idToDelete = parseInt(req.params.id, 10);
  
  const updateData = returnData.filter(entry => entry.id !== idToDelete);
  
  if(returnData.length === updateData.length){
    return res.status(404).json({message: '対象のIDが見つかりません' });
  }

  writeData(updateData);
  res.status(200).json({message: '削除しました' });
});

module.exports = router;