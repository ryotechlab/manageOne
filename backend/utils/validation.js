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

//パスワードのバリデーション関数
function validatePassword(password){
  const maxLength = 20;
  const minLength = 5;
  if(typeof password !== 'string' || password.trim() === ''){
    throw { status: 400, message: 'パスワードの入力は必須です' };
  }
  if(password.length <= minLength){
    throw { status: 400, message: 'パスワードは8文字以上にして下さい' };
  }
  if(password.length > maxLength){
    throw { status: 400, message: 'パスワードは12文字以内にして下さい' };
  }
}

module.exports = {
  validateName,
  validateDate,
  isEmpty,
  validatePassword,
};