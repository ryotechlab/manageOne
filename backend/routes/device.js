const express = require('express');
const router = express.Router();
const {getAllDevices} = require('../../db/database');

//GET - 一覧を取得
router.get('/',(req,res) => {
  getAllDevices( (err,rows) => {
    if(err){
      res.status(500).res.json({ error: 'DBエラー' });
    }else{
      res.status(200).json(rows);
    }
  });
});

module.exports = router;