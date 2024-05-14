const { Sequelize, sequelize } = require("./index");

const { Model, DataTypes } = require("sequelize");

const { ROLE_FIELD } = require("../helper/constant");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      // allowNull: false,
      unique: false,
    },
    fatherName: {
      type: DataTypes.STRING,
      // allowNull: false,
      unique: false,
    },
    village: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: false,
      // allowNull: false,
    },
    mobileNumbar: {
      type: DataTypes.STRING,
      unique: false,
      // allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    confirmPassword: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    role: {
      type: DataTypes.ENUM( ROLE_FIELD.ADMIN, ROLE_FIELD.USER, ROLE_FIELD.VOLUNTEER ), defaultValue: ROLE_FIELD.USER,
    },
    otp: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

  // User.sync({ force: true });
  // sequelize.sync({ force: true })

module.exports = User;