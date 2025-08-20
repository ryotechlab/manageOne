const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

function authMiddleware(req,res,next) {
  const authHeader = req.headers.authorization;
 if(!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ message: '認証トークンが必要です' });
 } 

 const token = authHeader.split(' ')[1];
 try{
  const decoded = jwt.verify(token, SECRET_KEY);
  req.user = decoded;//認証済みユーザー情報をリクエストにセット
  next();
 }catch(err){
  return res.status(401).json({ message: 'トークンが無効です' });
 }
}

module.exports = authMiddleware;