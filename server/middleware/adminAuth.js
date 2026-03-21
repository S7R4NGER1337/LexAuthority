const jwt = require('jsonwebtoken');

module.exports = function adminAuth(req, res, next) {
  const token = req.cookies?.admin_token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired session.' });
  }
};
