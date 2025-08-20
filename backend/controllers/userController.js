const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { isEmpty } = require('../utils/validation');

//ユーザー一覧取得
const getUsers = (req,res) => {
  const users = userModel.getAllUsers();
  res.status(200).json(users);
};

//ユーザー登録
const createUser = (req,res) => {
  const { name, password } = req.body;
  if ([name, password].some(isEmpty)) {
    return res.status(400).json({ message: '正しく入力して下さい' });
  }

  const result = userModel.postUsers(name, password);
  res.status(201).json({ message: '登録に成功しました', ...result });
};

//ログイン
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

const login = (req,res) => {
  const { name, password } = req.body;
  if([name, password].some(isEmpty)) {
    return res.status(400).json({ message: '正しく入力して下さい' });
  }

  const user = userModel.findUserByName(name);
  if(!user) {
    return res.status(401).json({ message: 'ユーザー名が違います' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  console.log(user.password);
  if(!isMatch) {
    return res.status(401).json({ message: 'パスワードが違います' });
  }

  //JWTトークンを発行
  const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, name: user.name });
};

module.exports = {
  getUsers,
  createUser,
  login,
};