const Game = require("../models/games");

class GameRepository {
  async findAll() {
    return await Game.findAll();
  }

  async findById(id) {
    return await Game.findByPk(id);
  }

  async create(data) {
    return await Game.create(data);
  }

  async update(id, data) {
    const game = await Game.findByPk(id);
    if (game) {
      return await game.update(data);
    }
    return null;
  }

  async delete(id) {
    const game = await Game.findByPk(id);
    if (game) {
      await game.destroy();
      return true;
    }
    return false;
  }
}

module.exports = GameRepository;
