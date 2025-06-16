const { db } = require('../../db/database');
const { validateName } = require('../utils/validation');

//ユーザー一覧取得
function getAllUsers() {
  const sql = 'SELECT id, name FROM users';
  return db.prepare(sql).all();
}

//ユーザー登録
function postUsers(userName) {
  validateName(userName, 'ユーザー名');

  const checkSql = 'SELECT id FROM users WHERE name = ?';
  const existingUser = db.prepare(checkSql).get(userName);

  if (existingUser) {
    throw { status: 409, message: 'このユーザーは既に存在しています' };
  }

  const sql = 'INSERT INTO users (name) VALUES (?)';
  const info = db.prepare(sql).run(userName);

  return { id: info.lastInsertRowid, name: userName };
}

module.exports = {
  getAllUsers,
  postUsers,
};