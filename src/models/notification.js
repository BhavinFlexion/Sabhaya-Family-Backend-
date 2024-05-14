const { Sequelize, sequelize } = require("./index");

const { Model, DataTypes } = require("sequelize");

const User = require('./users');

const { STATUS_FIELD } = require("../helper/constant");

class Notification extends Model {}

Notification.init(
    {
    mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
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
        modelName: 'Notification',
        tableName: "notifications",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    }
);

module.exports = Notification;