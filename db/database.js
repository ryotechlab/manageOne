const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'manageOne.db');

//DB接続
let db;
try{
  db = new Database(dbPath);
  console.log('SQLiteデータベースに接続しました');
}catch(err){
  console.log('データベース接続エラー:',err.message);
}

module.exports = {
  db,
};