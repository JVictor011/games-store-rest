const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Games = sequelize.define("game", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Games;
