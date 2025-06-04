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
  db.all('SELECT * FROM borrow', [], (err, rows) => {
    callback(err, rows);
  });
}

//削除
function deleteBorrow(id, callback){
  db.run('DELETE FROM borrow WHERE id = ?', [id], function (err){
    callback(err, this.changes);//changes:削除件数(0または1)
  });
}

module.exports = {
  db,
  getAllBorrows,
  deleteBorrow,
};