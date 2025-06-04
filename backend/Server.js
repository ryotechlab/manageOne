require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const frontFilePath = path.join(__dirname,'..','frontend');

const deviceRoutes = require('./routes/device');
const borrowRoutes = require('./routes/borrow');
const returnRoutes = require('./routes/return');

app.use(cors());
app.use(express.json());
app.use(express.static(frontFilePath));//静的ファイルの提供

//APIのルーティングマウント
app.use('/api/device', deviceRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/return', returnRoutes);

//サーバー開設
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
  console.log(`Server is running on port ${PORT}`);
});