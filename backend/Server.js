require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const frontFilePath = path.join(__dirname,'..','frontend');

const borrowRoutes = require('./routes/borrow');
const deviceRoutes = require('./routes/device');
const returnRoutes = require('./routes/return');
const userRoutes = require('./routes/user');

app.use(cors());
app.use(express.json());
app.use(express.static(frontFilePath));

//APIのルーティングマウント
app.use('/api/borrow', borrowRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/return', returnRoutes);
app.use('/api/user', userRoutes);

//404ハンドラ
app.use((req,res,next) => {
  res.status(404).json({ error: 'Not Found' });
})

//APIのエラーハンドリング
app.use((err,req,res,next) => {
  console.error('エラー:', err);
  res.status(err.status || 500).json({ error: err.message || 'サーバーエラー' });
});

//サーバー開設
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
  console.log(`Server is running on port ${PORT}`);
});