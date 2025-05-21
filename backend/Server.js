require('dotenv').config();

const express = require('express');
const cors = require('cors');
const deviceRoutes = require('./routes/device');

const app = express();
app.use(cors());
app.use(express.json());

// app.get('/', (req, res) =>{
//   res.send('Hello World!');
// });

// app.post('/api/borrow' ,(req,res) => {
//   const { devicename, username, date} = req.body;

//   console.log("受信データ:");
//   console.log("機器名:", devicename);
//   console.log("ユーザー名:", username);
//   console.log("貸出日:", date);

//   res.json({message:'貸出申請を受け取りました'});
// });

//ルートにルーターをマウント
app.use('/api/device',deviceRoutes);

//サーバー開設
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
  console.log(`Server is running on port ${PORT}`);
});