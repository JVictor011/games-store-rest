const express = require("express");
const gameController = require("../controllers/gameController");

const router = express.Router();

router.get("/games", gameController.getAllGames);
router.get("/game/:id", gameController.getGameById);
router.post("/game", gameController.createGame);
router.put("/game/:id", gameController.updateGame);
router.delete("/game/:id", gameController.deleteGame);

module.exports = router;
