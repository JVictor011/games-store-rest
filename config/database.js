const Sequelize = require("sequelize");

const connection = new Sequelize("games_store", "root", "jovi", {
  host: "localhost",
  dialect: "mysql",
  timezone: "-03:00",
});

module.exports = connection;
