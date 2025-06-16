const { db } = require('../../db/database');
const { validateName } = require('../utils/validation');

//機器一覧取得
function getAllDevices() {
  const sql = 'SELECT id, name FROM devices';
  return db.prepare(sql).all();
}

//機器登録
function postDevices(deviceName) {
  validateName(deviceName, '機器名');

  const checkSql = 'SELECT id FROM devices WHERE name = ?';
  const existingDevice = db.prepare(checkSql).get(deviceName);

  if (existingDevice) {
    throw { status: 409, message: 'この機器は既に存在しています' };
  }

  const sql = 'INSERT INTO devices (name) VALUES (?)';
  const info = db.prepare(sql).run(deviceName);

  return { id: info.lastInsertRowid, name: deviceName };
}

module.exports = {
  getAllDevices,
  postDevices,
};