const { DataTypes } = require('sequelize');
const sequelize = require("../config/db");
// const Job_seeker = require('./job_seeker.model');
// const Job_offer = require('./job_offers.model');

const Candidats = sequelize.define(
    'Candidats',
    {
  idJob: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    onDelete: 'CASCADE',
  },
    idUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey:true ,
    onDelete: 'CASCADE',
    },
    
    
},
{ freezeTableName: true, timestamps: true }
);





module.exports = Candidats;
  

