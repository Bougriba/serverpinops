const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const job_offer = require("./job_offers.model")
const Recruiter = sequelize.define(
  "Recruiter",
  {
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      primaryKey: true,
    },
  },
  { freezeTableName: true, timestamps: true }
);
// Recruiter.hasMany(job_offer, {foreignKey : "recruiterId"});
// job_offer.belongsTo(Recruiter , {foreignKey : "recruiterId"});


module.exports = Recruiter;
