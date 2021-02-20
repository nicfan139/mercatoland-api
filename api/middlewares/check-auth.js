const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // "Authorization" header should have "Bearer <TOKEN>" value format
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 401,
      message: 'Authentication failed.',
    });
  }
};
