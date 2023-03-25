const isDev = process.env.NODE_ENV === "development";
require("dotenv").config({
  path: require("path").join(
    __dirname,
    isDev == "development" ? ".env.dev" : ".env"
  ),
});

const express = require("express");
const morgan = require("morgan");
const app = express();

const users = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const job_offerRoutes = require("./routes/job_offer.route");
const candidatRoute = require("./routes/candidats.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
if (isDev) {
  app.use(morgan("dev"));
}

app.use("/api/users", users);
app.use("/api/candidats", candidatRoute);
app.use("/api/jobs", job_offerRoutes);
app.use("/api/auth", authRoutes);

app.use((err, _, res, __) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({ status, message });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Server is working", port);
});
