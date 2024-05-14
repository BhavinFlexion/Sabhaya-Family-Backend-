const { Sequelize, sequelize } = require("./index");

const { Model, DataTypes } = require("sequelize");

const User = require('./users');

const { STATUS_FIELD } = require("../helper/constant");

class Gallery extends Model {}

Gallery.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    multipleImages: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
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
    modelName: 'Gallery',
    tableName: 'galleries',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
);

// Gallery.sync({ force: true });

module.exports = Gallery;