const express = require('express');
const { route } = require('./device');
const router = express.Router();

//仮のデータを格納(本来はDB使用)[
const  borrowRecords = [];

router.post('/',(req,res) => {
  const { deviceName, userName, date} = req.body;

  if(!deviceName || !userName || !date){
    return res.status(400).json({ massage: '全ての項目を入力して下さい' });
  }

  //レコードに追加
  const record = {
    id: borrowRecords.length + 1,
    deviceName,
    userName,
    date,
  };
  borrowRecords.push(record);

  console.log('貸出記録：', record);
  res.status(201).json({ message: '貸出処理が完了しました', record });
});

module.exports = router;