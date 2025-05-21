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

module.exports = router;