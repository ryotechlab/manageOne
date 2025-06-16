const userModel = require('../models/userModel');
const { isEmpty } = require('../utils/validation');

//ユーザー一覧取得
const getUsers = (req,res) => {
  const users = userModel.getAllUsers();
  res.status(200).json(users);
};

//ユーザー登録
const createUser = (req,res) => {
  const { name } = req.body;

  if (isEmpty(name)) {
    return res.status(400).json({ message: '正しく入力して下さい' });
  }

  const result = userModel.postUsers(name);
  res.status(201).json({ message: '登録に成功しました', ...result });
};

module.exports = {
  getUsers,
  createUser,
};