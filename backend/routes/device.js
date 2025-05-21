const express = require('express');
const router = express.Router();

//仮のデータ(後でDBに置き換える)
const device = [
  { id: 1, name: '測定器A', model: 'A-100', status: 'available'},
  { id: 2, name: '測定器B', model: 'A-200', status: 'borrowed'},
];

//GET - 一覧を取得
router.get('/',(req,res) => {
  //res.json({message:'機器一覧を取得しました(ダミー)'});
  res.json(device);
});

//POST- 貸出
// router.post('/borrow',(req,res) => {
//   const { deviceName, userName, date} = req.body;
//   res.json({
//     massage:'貸出リクエストを受け付けました',
//     data:{ deviceName, userName, date}
//   });
// });

// //DELETE - 返却(例)
// router.delete('/return/:deviceName',(req,res) => {
//   const { deviceName } = req.params;
//   res.json({message:`${deviceName}を返却しました(ダミー)`});
// });

module.exports = router;