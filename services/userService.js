class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async getUserById(id) {
    return await this.userRepository.findById(id);
  }

  async getFindByEmail(email) {
    return await this.userRepository.findByEmail(email);
  }

  async getFindByUsername(username) {
    return await this.userRepository.findByUsername(username);
  }

  async createUser(data) {
    return await this.userRepository.create(data);
  }

  async updateUser(id, data) {
    return await this.userRepository.update(id, data);
  }
}

module.exports = UserService;
