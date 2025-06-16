const { db } = require('../../db/database');
const { validateName, validateDate } = require('../utils/validation');

//貸出一覧取得
function getAllBorrows() {
  const sql = `
    SELECT 
      borrowings.id, 
      users.name AS userName, 
      devices.name AS deviceName, 
      borrowings.date 
    FROM borrowings 
    LEFT JOIN users ON borrowings.user_id = users.id 
    LEFT JOIN devices ON borrowings.device_id = devices.id
    ORDER BY borrowings.id DESC
  `;
  return db.prepare(sql).all();
}

//貸出登録(名前→ID(外部キー)変換含む)
function postBorrows(deviceName, userName, date) {
  validateName(deviceName, '機器名');
  validateName(userName, 'ユーザー名');
  validateDate(date);

  const getUserId = `SELECT id FROM users WHERE name = ?`;
  const getDeviceId = `SELECT id FROM devices WHERE name = ?`;

  const user = db.prepare(getUserId).get(userName);
  if (!user) {
    throw { status: 400, message: 'ユーザーが見つかりません' };
  }

  const device = db.prepare(getDeviceId).get(deviceName);
  if (!device) {
    throw { status: 400, message: '機器が見つかりません' }
  }

  const insertSql = 'INSERT INTO borrowings (user_id, device_id, date) VALUES (?, ?, ?)';
  const info = db.prepare(insertSql).run(user.id, device.id, date);

  return { id: info.lastInsertRowid };
}

//貸出削除
function deleteBorrow(id) {
  const sql = 'DELETE FROM borrowings WHERE id = ?';
  const info = db.prepare(sql).run(id);

  if (info.changes === 0) {
    throw { status: 404, message: 'データが見つかりません' };
  }
  
  return { message: '削除しました' };
}

module.exports = {
  getAllBorrows,
  postBorrows,
  deleteBorrow,
};