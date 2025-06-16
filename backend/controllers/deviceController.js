const deviceModel = require('../models/deviceModel');
const { isEmpty } = require('../utils/validation');

//機器一覧を取得
const getDevices = (req,res) => {
  const devices = deviceModel.getAllDevices();
  res.status(200).json(devices);
};

//機器登録
const createDevice = (req,res) => {
  const { name } = req.body;

  if(isEmpty(name)){
  return res.status(400).json({ message: '正しく入力して下さい' });
  }

  const result = deviceModel.postDevices(name);
  res.status(201).json({ message: '機器登録に成功しました', ...result });
};

module.exports = {
  getDevices,
  createDevice,
};