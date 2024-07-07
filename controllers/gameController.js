const GameService = require("../services/gameService");
const GameRepository = require("../repositories/gameRepository");

const gameRepository = new GameRepository();
const gameService = new GameService(gameRepository);

class GameController {
  async getAllGames(req, res) {
    try {
      const games = await gameService.getAllGames();
      res.status(200).json(games);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getGameById(req, res) {
    try {
      const game = await gameService.getGameById(req.params.id);

      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      } else {
        res.status(200).json(game);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createGame(req, res) {
    try {
      const newGame = await gameService.createGame(req.body);
      res.status(201).json(newGame);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateGame(req, res) {
    try {
      const updateGame = await gameService.updateGame(req.params.id, req.body);

      if (!updateGame) {
        return res.status(404).json({ error: "Game not found" });
      } else {
        res.status(200).json(updateGame);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteGame(req, res) {
    try {
      const deleteGame = await gameService.deleteGame(req.params.id);

      if (!deleteGame) {
        return res.status(404).json({ error: "Game not found" });
      } else {
        res.status(204).send();
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new GameController();
