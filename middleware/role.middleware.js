const createHttpError = require("http-errors");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const ROLES = {
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
  RECRUITER: "recruiter",
  JOB_SEEKER: "job_seeker",
};

const requires = (roles = []) =>
  asyncHandler((req, _, next) => {
    if (roles.length === 0) {
      next();
      return;
    }
    // get bearer token from header
    const authToken = req.headers.authorization ?? "";
    if (!authToken) {
      throw createHttpError(401, "Unauthorized");
    }

    const authTokenParts = authToken.split(" ");
    if (authTokenParts.length !== 2) {
      throw createHttpError(401, "Unauthorized");
    }

    const token = authTokenParts[1];
    if (!token) {
      throw createHttpError(401, "Unauthorized");
    }
    console.log(req.headers.authorization);

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const role = decodedToken.role;

      if (!roles.includes(role)) {
        throw createHttpError(403, "Forbidden");
      }

      req.user = decodedToken;

      next();
    } catch (error) {
      throw createHttpError(401, error.message);
    }
  });

module.exports = {
  ROLES,
  requires,
};
