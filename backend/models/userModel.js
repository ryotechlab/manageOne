const bcrypt = require('bcryptjs');
const { db } = require('../../db/database');
const { validateName, validatePassword } = require('../utils/validation');

//ユーザー一覧取得
function getAllUsers() {
  const sql = 'SELECT id, name FROM users';
  return db.prepare(sql).all();
}

//ユーザー登録
function postUsers(userName, password) {
  validateName(userName, 'ユーザー名');
  validatePassword(password);

  const checkSql = 'SELECT id FROM users WHERE name = ?';
  const existingUser = db.prepare(checkSql).get(userName);

  if (existingUser) {
    throw { status: 409, message: 'このユーザーは既に存在しています' };
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO users (name, password) VALUES (?, ?)';
  const info = db.prepare(sql).run(userName, hashedPassword);

  return { id: info.lastInsertRowid, name: userName };
}

//ユーザー検索(ログインに使用)
function findUserByName(name) {
  const sql = 'SELECT * FROM users WHERE name = ?';
  return db.prepare(sql).get(name);
}

module.exports = {
  getAllUsers,
  postUsers,
  findUserByName,
};