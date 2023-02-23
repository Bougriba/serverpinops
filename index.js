const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors');
app.use(cors());

require("dotenv").config();

const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const job_offerRoutes = require("./routes/job_offer.route");
const candidatRoute = require("./routes/candidats.route");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/candidats", candidatRoute);
app.use("/api/jobs", job_offerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(cors({
  origin: 'http://localhost:3001',
}));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Server is working" + port);
});
