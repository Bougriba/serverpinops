const isDev = process.env.NODE_ENV === "development";
require("dotenv").config({
  path: require("path").join(
    __dirname,
    isDev == "development" ? ".env.dev" : ".env"
  ),
});

// const multer = require("multer");
// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
//   if (!allowedMimeTypes.includes(file.mimetype)) {
//     cb(new Error('Only PDF, JPEG, and PNG files are allowed'));
//   } else {
//     cb(null, true);
//   }
// };

// const upload = multer({ storage,fileFilter });

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const users = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const job_offerRoutes = require("./routes/job_offer.route");
const candidatRoute = require("./routes/candidats.route");

const createprofile = require("./routes/createprofile.route");
const adminroutes = require("./routes/admin.route");
const superadminroute = require("./routes/superadmin.route");
const { requires, ROLES } = require("./middleware/role.middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
if (isDev) {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const { requires } = require("../middleware/role.middleware");
const adminOnly = requires([ROLES.SUPERADMIN]);

// app.use(upload.single("pdf"));
// app.use(upload.single("pdf"));
app.use("/api/superadmin", adminOnly, superadminroute);
app.use("/api/admin", adminroutes);
app.use("/api/profile", createprofile);
app.use("/api/candidats", candidatRoute);
app.use("/api/jobs", job_offerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", users);

app.use((err, _, res, __) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ status, message });
});

const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log("Server is working", port);
});
