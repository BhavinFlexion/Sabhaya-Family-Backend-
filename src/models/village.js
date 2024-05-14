const { Sequelize, sequelize } = require("./index");

const { Model, DataTypes } = require("sequelize");

const User = require('./users');

class Village extends Model {}

Village.init(
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
    taluka: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "Village",
    tableName: "villages",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);


// Village.sync({ force: true });

module.exports = Village;
