const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key'; // Same key used in login

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Attach user info to req
    next();
  });
}

module.exports = authenticateToken;
