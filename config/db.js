const { Sequelize } = require("sequelize");

const db = new Sequelize("postgres", "postgres", "mahdi", {
  host: "localhost",
  port: 5000,
  dialect: "postgres",
});

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

db.sync()
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((error) => {
    console.error("An error occurred while synchronizing the models:", error);
  });

module.exports = db;