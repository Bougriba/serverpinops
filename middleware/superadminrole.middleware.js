const authMiddleware = require("./auth.middleware");
const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");

const roleMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

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
    if (role !== "superadmin") {
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

const requires = (roles) =>
  asyncHandler((req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.PASSWORD_HASH_TOKEN);
      const role = decodedToken.role;

      if (!roles.includes(role)) {
        throw createHttpError(403, "Forbidden");
      }

      next();
    } catch (error) {
      throw createHttpError(401, "Unauthorized");
    }
  });

module.exports = roleMiddleware;
