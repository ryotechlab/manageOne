const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'manageOne.db');

//DB接続
const db = new sqlite3.Database(dbPath, (err) => {
  if(err){
    console.log('データベース接続エラー:', err.message);
  }else{
    console.log('SQLite データベースに接続しました');
  }
});

//一覧取得
function getAllBorrows(callback){
  const sql = `
   SELECT 
      borrowings.id, 
      users.name AS userName, 
      devices.name AS deviceName, 
      borrowings.date 
    FROM borrowings 
    JOIN users ON borrowings.user_id = users.id 
    JOIN devices ON borrowings.device_id = devices.id
  `;
  db.all(sql, [], (err, rows) => {
    callback(err, rows);
  });
}

//貸出登録
function postBorrows(deviceName, userName, date, callback){
  const getUserId = `SELECT id FROM users WHERE name = ?`;
  const getDeviceId = `SELECT id FROM devices WHERE name = ?`;

  db.get(getUserId, [userName], (err, user) => {
    if (err || !user) {
      return callback({ status: 400, message: 'ユーザーが見つかりません' });
    }

    db.get(getDeviceId, [deviceName], (err, device) => {
      if (err || !device) {
        return callback({ status: 400, message: '機器が見つかりません' });
      }

      const insertSql = 'INSERT INTO borrowings (user_id, device_id, date) VALUES (?, ?, ?)';
      db.run(insertSql, [user.id, device.id, date], function (err) {
        if (err) {
          return callback({ status: 500, message: 'データベースへの登録に失敗しました' });
        }
        callback(null, { id: this.lastID });
      });
    });
  });
}

//削除
function deleteBorrow(id, callback){
  const sql = 'DELETE FROM borrowings WHERE id = ?';
  db.run(sql, [id], function (err){
    if(err){
      return callback({ status: 500, massage: '削除に失敗しました' });
    }else if(this.changes === 0){
      return callback({ status: 404, massage: 'データが見つかりません' });
    }
    callback(null);
  });
}

module.exports = {
  db,
  getAllBorrows,
  postBorrows,
  deleteBorrow,
};