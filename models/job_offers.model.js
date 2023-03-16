const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Recruiter = require("./recruiter.model");
const User = require("./user.model");
const Candidats = require("./candidats.model");
const job_offer = sequelize.define(
  "job_offer",
  {
    // id: {
    // type: DataTypes.INTEGER,
    // allowNull: false,
    // primaryKey: true,
    // autoIncrement : true
    // },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salary: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    job_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    verified:
    {
      type: DataTypes.BOOLEAN,
      allowNull : true,
      defaultvalue : false ,
    }
  },
  { freezeTableName: true, timestamps: true }
);

job_offer.hasMany(Candidats, { foreignKey: "idJob" });
Candidats.belongsTo(job_offer, { foreignKey: "idJob" });

module.exports = job_offer;
