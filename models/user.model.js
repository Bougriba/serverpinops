const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Recruiter = require("./recruiter.model");
const job_offer = require("./job_offers.model");
const candidats = require("./candidats.model");
const Job_seeker = require("./job_seeker.model");
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      require: true,
      validate: {
        isEmail: true,
      },
    },
    age: {
      type: DataTypes.INTEGER,
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      validate: {
        min: 8,
        isInt: true,
      },
    },
    imageType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageData: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["recruiter", "job_seeker", "admin", "superAdmin"],
      require: true,
      allowNull: false,
    },
    genre : 
    {
      type: DataTypes.ENUM,
      values: ["male", "female"],
      require: true,
      allowNull : false,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

// User.beforeCreate(async (user, options) => {
//   const hashedPassword = await bcrypt.hash(user.password, 10);
//   user.password = hashedPassword;
// });
//association user- recruiter
User.hasOne(Recruiter, { foreignKey: "idUser" });
Recruiter.belongsTo(User, { foreignKey: "idUser" });
//association user - job_seeker
User.hasOne(Job_seeker, { foreignKey: "idUser" });
Job_seeker.belongsTo(User, { foreignKey: "idUser" });

User.hasMany(job_offer, { foreignKey: "idUser" });
job_offer.belongsTo(User, { foreignKey: "idUser" });

User.hasMany(candidats, { foreignKey: "idUser" });
candidats.belongsTo(User, { foreignKey: "idUser" });

module.exports = User;
