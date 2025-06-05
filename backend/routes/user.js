const express = require('express');
const router = express.Router();
const {getAllUsers} = require('../../db/database');

//GET /api/users → 全ユーザー取得
router.get('/', (req,res) => {
  getAllUsers((err,rows) => {
    if(err){
      res.status(500).json({ err: 'DBエラー' });
    }else{
      res.status(200).json(rows);
    }
  });
});

module.exports = router;