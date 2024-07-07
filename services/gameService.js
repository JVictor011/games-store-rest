class GameService {
  constructor(gameRepository) {
    this.gameRepository = gameRepository;
  }

  async getAllGames() {
    return await this.gameRepository.findAll();
  }

  async getGameById(id) {
    return await this.gameRepository.findById(id);
  }

  async createGame(data) {
    return await this.gameRepository.create(data);
  }

  async updateGame(id, data) {
    return await this.gameRepository.update(id, data);
  }

  async deleteGame(id) {
    return await this.gameRepository.delete(id);
  }
}

module.exports = GameService;
