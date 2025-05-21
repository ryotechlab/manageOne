const express = require('express');
const router = express.Router();

//一時的に借りたデータを保持(実際にはDBで管理)
let borrowedDevices = [
  {
    deviceName: '測定器A',
    userName: '田中',
    date: '2025-05-13',
    returned: false,
  },
];

//返却API
router.post('/',(req,res) => {
  const { deviceName, userName } = req.body;

  const target = borrowedDevices.find(
    (record) => record.deviceName === deviceName && record.userName === userName && !record.returned
  );

  if(!target){
    return res.status(404).json({ message: '該当の貸出記録が見つかりません' });
  }

  target.returned = true;
  target.returnDate = new Date().toISOString().split('T')[0];//今日の日付を返却日として記録

  res.json({ message: '返却が完了しました', record: target });
});

module.exports = router;