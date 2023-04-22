const authMiddleware = require('./auth.middleware');
const jwt = require('jsonwebtoken');

const roleMiddleware = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.PASSWORD_HASH_TOKEN);

    const role = decodedToken.role;

    //if (role !== 'admin' && role !== 'superadmin' && role !== 'recruiter') {
    if (role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = roleMiddleware;
