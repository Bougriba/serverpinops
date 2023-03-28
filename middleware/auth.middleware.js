const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token)

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauth",
    });
  }

  try {
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;

    next();
  } catch (error) {
    
    return res.status(401).json({
      success: false,
      message: console.log(error)
    });
  }
};

module.exports = authMiddleware;
