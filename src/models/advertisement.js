const { Sequelize, sequelize } = require("./index");

const { Model, DataTypes } = require("sequelize");

const User = require('./users');

const { STATUS_FIELD, ADVERTISEMENTS_TYPE } = require("../helper/constant");

class Advertisement extends Model {}

Advertisement.init(
  {
    advertisements: {
      type: DataTypes.ENUM(ADVERTISEMENTS_TYPE.SELF, ADVERTISEMENTS_TYPE.OTHER),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
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
    modelName: 'Advertisement',
    tableName: 'advertisements',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

// Advertisement.sync({ force: true });

module.exports = Advertisement;