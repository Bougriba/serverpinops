const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.PASSWORD_HASH_TOKEN);
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware;
