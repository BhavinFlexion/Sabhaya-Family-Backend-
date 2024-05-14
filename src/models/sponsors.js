const { Sequelize, sequelize } = require("./index");

const { Model, DataTypes } = require("sequelize");

const User = require('./users');

const { STATUS_FIELD, GENDER_FIELD, BUSINESS_TYPE } = require("../helper/constant");

class Sponsors extends Model {}

Sponsors.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    village: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    member: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAdvertisement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    received: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sponsorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    advertisementCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sponsorImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM( STATUS_FIELD.ACTIVE, STATUS_FIELD.DEACTIVE ),defaultValue: STATUS_FIELD.ACTIVE,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Sponsors",
    tableName: "sponsors",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

// Sponsors.sync({ force: true });
module.exports = Sponsors;  