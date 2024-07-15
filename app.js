const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const gameRouter = require("./routes/gameRoutes");
const userRouter = require("./routes/userRoutes");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", gameRouter);
app.use("/api", userRouter);

module.exports = app;
