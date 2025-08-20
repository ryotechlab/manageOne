//入力バリデーションを関数に切り出し
const isEmpty = value => value === null || typeof value !== 'string' || value.trim() === '';
function validateInput({ deviceName, userName, date }){
  if(!deviceName || !userName || !date){
    return '全ての項目を入力して下さい';
  }
  //追加のチェックが有ればここに書ける
  if(deviceName.length > 50){
    return '機器名は50文字以内にして下さい';
  }
  return null;//エラーなし
}

const messageDiv = document.getElementById('message');

//メッセージ表示関数
function showMessage(text, type){
  messageDiv.textContent = text;
  messageDiv.style.color = type === 'error' ? 'red' : 'green';
}

//メッセージクリア関数
function clearMessage(){
  messageDiv.textContent = '';
}

//ユーザー、機器をドロップダウンへ表示関数
async function loadMasterData() {
  const [usersRes, devicesRes] = await Promise.all([
    fetch('/api/user'),
    fetch('/api/device')
  ]);

  const users = await usersRes.json();
  const devices = await devicesRes.json();

  const userSel = document.getElementById('userSelect');
  const deviceSel = document.getElementById('deviceSelect');

  userSel.innerHTML = '';
  deviceSel.innerHTML = '';

  userSel.add(new Option('ユーザーを選択して下さい','',true,true));
  userSel.options[0].disabled = true;
  deviceSel.add(new Option('機器を選択して下さい','',true,true));
  deviceSel.options[0].disabled = true;

  users.forEach(u => userSel.add(new Option(u.name, u.name)));
  devices.forEach(d => deviceSel.add(new Option(d.name, d.name)));
}

//貸出登録
document.getElementById('borrowForm').addEventListener('submit',async (e) => {
  e.preventDefault();//デフォルトの送信処理(HTML)をキャンセル

  clearMessage();//前のメッセージをクリア
  
  //1,入力値の取得
  const deviceName = document.getElementById('deviceSelect').value.trim();
  const userName = document.getElementById('userSelect').value.trim();
  const date = document.getElementById('date').value;

  //2.フロント側でのバリデーションチェック
  const errMessage = validateInput({ deviceName, userName, date });
  if(errMessage){
    showMessage(errMessage, 'error');
    return;
  }

  try{
    //3.fetchでPOST通信
    const res = await fetch('/api/borrow',{
    method: 'POST',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify({deviceName, userName, date })
    });

    const result = await res.json();

    //4.ステータスコードのチェック
    if(!res.ok){
      //サーバーエラーの場合
      showMessage(`サーバーエラー：${result.message || '不明なエラー'}`, 'error');
      return;
    }

    //成功レスポンスを処理
    showMessage(`成功：${result.message}`, 'success');
    //フォームを初期化
    document.getElementById('borrowForm').reset();
    fetchBorrowList();//成功時に再取得

  }catch(err){
    //通信そのものが失敗した場合(ネットワークエラーなど)
    console.log('通信エラー：', err);
    showMessage('通信エラーが発生しました。ネットワークを確認して下さい', 'error');
  }
});

const borrowList = document.getElementById('borrowList');

//貸出一覧取得
async function fetchBorrowList(){
  try{
    const res = await fetch('/api/borrow');
    const data = await res.json();

    borrowList.innerHTML = '';

    data.forEach(item => {
      const row = document.createElement('tr');

      const deviceNameCell = document.createElement('td');
      deviceNameCell.textContent = item.deviceName;

      const userNameCell = document.createElement('td');
      userNameCell.textContent = item.userName;

      const dateCell = document.createElement('td');
      dateCell.textContent = item.date;

      const deleteCell = document.createElement('td');
      const deleteButton = document.createElement('Button');
      deleteButton.textContent = '削除';
      deleteButton.addEventListener('click', () => deleteBorrow(item.id));
      deleteCell.appendChild(deleteButton);

      row.appendChild(deviceNameCell);
      row.appendChild(userNameCell);
      row.appendChild(dateCell);
      row.appendChild(deleteCell);

      borrowList.appendChild(row);
    });

  }catch(err){
    console.error('一覧取得失敗', err);
    showMessage('貸出一覧の取得に失敗しました', 'error');
  }
}

//貸出削除
async function deleteBorrow(id){
  if(!confirm('このデータを削除してもよろしいですか？')) return;

  try{
    const res = await fetch(`/api/borrow/${id}`, {
      method: 'DELETE'
    });

    const result = await res.json();

    if(!res.ok){
      showMessage(`削除エラー: ${result.message || '不明なエラー'}`, 'error');
      return;
    }

    showMessage(result.message, 'success');
    fetchBorrowList();//削除後に再取得

  }catch(err){
    console.error('削除エラー:', err);
    showMessage('削除に失敗しました', 'error');
  }
}

//ユーザー登録
async function addUser(){
  const newUserNameInput = document.getElementById('newUserName');
  const newUserPassword = document.getElementById('newUserPassword');
  const addUserButton = document.getElementById('registerUser');
  const name = newUserNameInput.value;
  const password = newUserPassword.value;

  const token = localStorage.getItem('token');

  if(isEmpty(name)) return showMessage('ユーザー名を正しく入力して下さい', 'error');
  if(isEmpty(password)) return showMessage('パスワードを正しく入力して下さい', 'error');

  addUserButton.disabled = true;
  addUserButton.textContent = '登録中...';

  try{
    const res = await fetch('/api/user', {
    method: 'POST',
    headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({name,password})
    });

    const result = await res.json();
    if(!res.ok){
      showMessage(`登録エラー:${result.message || 不明なエラー}`,'error');
      return;
    }

    showMessage(`ユーザー登録に成功しました:${result.name}`,'success');
    newUserNameInput.value = '';
    newUserPassword.value = '';
    loadMasterData();
  }catch(err){
    console.error('登録エラー:', err);
    newUserNameInput.value = '';
    newUserPassword.value = '';
    showMessage('ユーザー登録に失敗しました', 'error');
  }finally{
    addUserButton.disabled = false;
    addUserButton.textContent = '登録';
  }
}
document.getElementById('registerUser').addEventListener('click',addUser);

//機器登録
async function addDevice(){
  const newDeviceNameInput = document.getElementById('newDeviceName');
  const addDeviceButton = document.getElementById('registerDevice');
  const name = newDeviceNameInput.value;

  if(isEmpty(name)) return showMessage('機器名を正しく入力して下さい', 'error');

  addDeviceButton.disabled = true;
  addDeviceButton.textContent = '登録中...';

  try{
    const res = await fetch('/api/device', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({name})
    });

    const result = await res.json();
    if(!res.ok){
      showMessage(`登録エラー:${result.message || 不明なエラー}`, 'error');
      return;
    }

    showMessage(`機器登録に成功しました:${result.name}`, 'success');
    newDeviceNameInput.value = '';
    loadMasterData();
  }catch(err){
    console.error('登録エラー:', err);
    newDeviceNameInput.value = '';
    showMessage('機器登録に失敗しました', 'error');
  }finally{
    addDeviceButton.disabled = false;
    addDeviceButton.textContent = '登録';
  }
}
document.getElementById('registerDevice').addEventListener('click',addDevice);

//ログイン処理
async function handleLogin(e){
  e.preventDefault();
  const loginNameInput = document.getElementById('loginName');
  const name = loginNameInput.value;
  const loginPasswordInput = document.getElementById('loginPassword');
  const password = loginPasswordInput.value;
  const loginMessage = document.getElementById('loginMessage');

  try{
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password })
    });
    const result = await res.json();

    if(!res.ok) {
      loginMessage.textContent = result.message || 'ログイン失敗';
      loginMessage.style.color = 'red';
      return;
    }

    //トークンをlocalStorageに保存
    localStorage.setItem('token', result.token);
    loginMessage.textContent = 'ログイン成功';
    loginMessage.style.color = 'green';

    loginNameInput.value = '';
    loginPasswordInput.value = '';
    loadMasterData();

  }catch(err){
    loginMessage.textContent = '通信エラー';
    loginMessage.style.color = 'red';
    loginNameInput.value = "";
    loginPasswordInput.value = "";
    loadMasterData();
  }
}
document.getElementById('loginForm').addEventListener('submit',handleLogin);

//ログアウト処理
function handleLogout(){
  localStorage.removeItem('token');
  alert('ログアウトしました');
  //必要なら画面リロードやUI更新
}
document.getElementById('logoutBtn').addEventListener('click',handleLogout);

//ページ読込時に一覧を取得
window.addEventListener('DOMContentLoaded', () => {
  fetchBorrowList();
  loadMasterData();
});
