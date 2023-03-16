const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
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

const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const job_offerRoutes = require("./routes/job_offer.route");
const candidatRoute = require("./routes/candidats.route");
const createprofile = require("./routes/createprofile.route");
const adminroutes = require("./routes/admin.route");
const superadminroute = require("./routes/superadmin.route");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// app.use(upload.single("pdf"));
// app.use(upload.single("pdf"));
app.use("/api/superadmin", superadminroute);
app.use("/api/admin", adminroutes);
app.use("/api/profile", createprofile);
app.use("/api/candidats", candidatRoute);
app.use("/api/jobs", job_offerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Server is working" + port);
});
