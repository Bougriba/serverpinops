const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const Candidats = require("./candidats.model");
const Job_seeker = sequelize.define(
  "Job_seeker",
  {
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      primaryKey: true,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    degrees: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    majors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull : false
    },
  },
  { freezeTableName: true, timestamps: true }
);

Job_seeker.hasMany(Candidats, {foreignKey: "idJobseeker"});
Candidats.belongsTo(Job_seeker , {foreignKey: "idJobseeker"});

module.exports = Job_seeker;
