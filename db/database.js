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

//貸出一覧取得
function getAllBorrows(){
  try{
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
  }catch(err){
    console.error('getAllBorrowsエラー:', err);
    throw { status: 500, message: '貸出一覧の取得に失敗しました' };
  }
}

//貸出登録(名前→ID(外部キー)変換含む)
function postBorrows(deviceName, userName, date){
  try{
    const getUserId = `SELECT id FROM users WHERE name = ?`;
    const getDeviceId = `SELECT id FROM devices WHERE name = ?`;

    const user = db.prepare(getUserId).get(userName);
    if(!user){
      throw { status: 400, message: 'ユーザーが見つかりません' };
    }

    const device = db.prepare(getDeviceId).get(deviceName);
    if(!device){
      throw { status: 400, message: '機器が見つかりません' }
    }

    const insertSql = 'INSERT INTO borrowings (user_id, device_id, date) VALUES (?, ?, ?)';
    const info = db.prepare(insertSql).run(user.id,device.id,date);

    return { id: info.lastInsertRowid };
  }catch(err){
    console.error('postBorrows エラー:', err);
    throw err.status
      ?err
      : { status: 500, message: '貸出登録に失敗しました' };
  }
}

//貸出削除
function deleteBorrow(id){
  try{
    const sql = 'DELETE FROM borrowings WHERE id = ?';
    const info = db.prepare(sql).run(id);

    if(info.changes === 0){
      throw { status: 404, message: 'データが見つかりません' };
    }

  }catch(err){
    throw err.status
      ?err
      : { status: 500, message: '貸出削除に失敗しました' };
  }
}

//ユーザー一覧取得
function getAllUsers(){
  try{
    const sql = 'SELECT id, name FROM users';
    return db.prepare(sql).all();
  }catch(err){
    console.error('getAllUsers エラー:', err);
    throw { status: 500, message: 'ユーザー一覧取得に失敗しました' };
  }
}

//ユーザー登録
function postUsers(userName){
  try{
    const checkSql = 'SELECT id FROM users WHERE name = ?';
    const existingUser = db.prepare(checkSql).get(userName);

    if(existingUser){
      throw { status: 409, message: 'このユーザーは既に存在しています' };
    }

    const sql = 'INSERT INTO users (name) VALUES (?)';
    const info = db.prepare(sql).run(userName);

    return { status: 201, id: info.lastInsertRowid, name: userName};
  }catch(err){
    console.error('postUsers エラー:', err);
    if(err.status) throw err;
    throw { status: 500, message: 'ユーザー登録に失敗しました' };
  }
}

//機器一覧取得
function getAllDevices(){
  try{
    const sql = 'SELECT id, name FROM devices';
    return db.prepare(sql).all();
  }catch(err){
    console.error('getAllDevices エラー:', err);
    throw { status: 500, message: '機器一覧取得失敗しました' };
  }
}

//機器登録
function postDevices(deviceName){
  try{
    const checkSql = 'SELECT id FROM devices WHERE name = ?'
    const existingDevice = db.prepare(checkSql).get(deviceName);

    if(existingDevice){
      throw { status: 409, message: 'この機器は既に存在しています' };
    }

    const sql = 'INSERT INTO devices (name) VALUES (?)';
    const info = db.prepare(sql).run(deviceName);

    return { status: 201, id: info.lastInsertRowid, name: deviceName};
  }catch(err){
    console.error('postDevices エラー:', err);
    if(err.status) throw err;
    throw { status: 500, message: '機器登録に失敗しました' };
  }
}

module.exports = {
  db,
  getAllBorrows,
  postBorrows,
  deleteBorrow,
  getAllUsers,
  postUsers,
  getAllDevices,
  postDevices,
};