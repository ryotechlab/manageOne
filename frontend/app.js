//入力バリデーションを関数に切り出し
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

//貸出登録
document.getElementById('borrowForm').addEventListener('submit',async (e) => {
  e.preventDefault();//デフォルトの送信処理(HTML)をキャンセル

  clearMessage();//前のメッセージをクリア
  
  //1,入力値の取得
  const deviceName = document.getElementById('deviceName').value.trim();
  const userName = document.getElementById('userName').value.trim();
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

    //4.ステータスコードのチェック
    if(!res.ok){
      //サーバーエラーの場合
      const errorData = await res.json();
      showMessage(`サーバーエラー：${errorData.message || '不明なエラー'}`, 'error');
      return;
    }

    //成功レスポンスを処理
    const result = await res.json();
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

//一覧取得
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

//削除
async function deleteBorrow(id){
  if(!confirm('このデータを削除してもよろしいですか？')) return;

  try{
    const res = await fetch(`/api/borrow/${id}`, {
      method: 'DELETE'
    });

    if(!res.ok){
      const errorData = await res.json();
      showMessage(`削除エラー: ${errorData.message || '不明なエラー'}`, 'error');
      return;
    }

    const result = await res.json();
    showMessage(result.message, 'success');
    fetchBorrowList();//削除後に再取得

  }catch(err){
    console.error('削除エラー:', err);
    showMessage('s削除に失敗しました', 'error');
  }
}

//ページ読込時に一覧を取得
window.addEventListener('DOMContentLoaded', fetchBorrowList);