const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//Routes
const gameRouter = require("./routes/gameRoutes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", gameRouter);

module.exports = app;
