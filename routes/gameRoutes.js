const express = require("express");
const GameController = require("../controllers/gameController");
const gameController = require("../controllers/gameController");

const router = express.Router();

router.get("/games", GameController.getAllGames);
router.get("/game/:id", gameController.getGameById);
router.post("/game", gameController.createGame);
router.put("/game/:id", gameController.updateGame);
router.delete("/game/:id", gameController.deleteGame);

module.exports = router;
