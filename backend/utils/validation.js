//ユーザー名・機器名のバリデーションチェック関数
function validateName(name, label = '名称'){
  if(typeof name !== 'string' || name.trim() === ''){
    throw { status: 400, message: `${label}は必須です`};
  }
  //必要に応じて禁止文字のバリデーションも追加
}

//日付のバリデーションチェック関数
function validateDate(date){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){
    throw { status: 400, message: '日付はYYYY-MM-DD形式で入力してください' };
  }
  //必要に応じて未来日付・過去日付の制限も追加可能
}

//空・スペースのみを検査
const isEmpty = value => typeof value !== 'string' || value.trim() === '';

module.exports = {
  validateName,
  validateDate,
  isEmpty,
};