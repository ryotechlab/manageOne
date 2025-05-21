require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const deviceRoutes = require('./routes/device');

app.use(cors());
app.use(express.json());

//デバイスAPIのルーティング(マウント)
app.use('/api/device',deviceRoutes);

//サーバー開設
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
  console.log(`Server is running on port ${PORT}`);
});