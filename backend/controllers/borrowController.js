const borrowModel = require('../models/borrowModel');
const { isEmpty } = require('../utils/validation');

// 一覧取得
const getBorrowing = (req, res) => {
  const borrowing = borrowModel.getAllBorrows();
  res.status(200).json(borrowing);
};

// 貸出登録
const postBorrowing = (req, res) => {
  const { deviceName, userName, date } = req.body;
  // フロントからの値の有無のみチェック
  if ([deviceName, userName, date].some(isEmpty)) {
    throw { status: 400, message: '全ての項目を正しく選択・入力して下さい' };
  }
  // DB・日付バリデーションはmodel層で実施
  const result = borrowModel.postBorrows(deviceName, userName, date);
  res.status(201).json({ message: '貸出登録に成功しました', ...result });
};

// 削除
const deleteBorrowing = (req, res) => {
  const result = borrowModel.deleteBorrow(Number(req.params.id));
  res.status(200).json({ message: '削除に成功しました', ...result });
};

module.exports = {
  getBorrowing,
  postBorrowing,
  deleteBorrowing,
};