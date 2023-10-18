const jwt = require('jsonwebtoken');
const UnauthorizedStatus = require('../errors/UnauthorizedStatus');

const { SECRET_KEY = 'movies' } = process.env;

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     next(new UnauthorizedStatus('Необходима авторизация.'));
//     return;
//   }

//   const token = authorization.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(token, SECRET_KEY);
//   } catch (err) {
//     next(new UnauthorizedStatus('Необходима авторизация.'));
//     return;
//   }q
//   req.user = payload;
//   next();
// };
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedStatus('You need to log in'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return next(new UnauthorizedStatus('You need to log in'));
  }
  req.user = payload;
  return next();
};