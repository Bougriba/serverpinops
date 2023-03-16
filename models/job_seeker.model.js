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
      allowNull: true,
    },
    degrees: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    majors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull : true
    },
    pdfdata: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
    },
    pdfName: {
      type: DataTypes.STRING, 
      allowNull:true,
    },
    pdfType:
    {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  { freezeTableName: true, timestamps: true }
);

// Job_seeker.hasMany(Candidats, {foreignKey: "idJobseeker"});
// Candidats.belongsTo(Job_seeker , {foreignKey: "idJobseeker"});

module.exports = Job_seeker;
