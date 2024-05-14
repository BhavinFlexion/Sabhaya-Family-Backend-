  const { Sequelize, sequelize } = require("./index");

  const { Model, DataTypes } = require("sequelize");

  const User = require('./users');

  const { STATUS_FIELD, GENDER_FIELD, BUSINESS_TYPE } = require("../helper/constant");

  class Members extends Model {}

  Members.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      profile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fatherName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      familyMembersCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      gender: {
        type: DataTypes.ENUM(GENDER_FIELD.MALE, GENDER_FIELD.FEMALE, GENDER_FIELD.OTHER),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bloodGroup: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      residentAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      village: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      occupation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      businessType: {
        type: DataTypes.ENUM(BUSINESS_TYPE.JOB, BUSINESS_TYPE.OWNER),
        allowNull: true,
      },
      businessName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      businessAddress: {
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
      modelName: "Members",
      tableName: "members",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

// Members.sync({ force: true });

module.exports = Members;