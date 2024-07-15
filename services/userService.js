class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async getFindByEmail(email) {
    return await this.userRepository.findByEmail(email);
  }

  async createUser(data) {
    return await this.userRepository.create(data);
  }

  async updateUser(data) {
    return await this.userRepository.update(data);
  }
}

module.exports = UserService;
