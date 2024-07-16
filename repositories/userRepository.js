const Users = require("../models/Users");

class UserRepository {
  async findAll() {
    return await Users.findAll();
  }

  async create(data) {
    return await Users.create(data);
  }

  async findByEmail(email) {
    return await Users.findOne({ where: { email } });
  }

  async findByUsername(username) {
    return await Users.findOne({ where: { username } });
  }

  async update(data) {
    const user = await this.findByEmail(data.email);
    if (user) {
      return await user.update(data);
    }
    return null;
  }
}

module.exports = UserRepository;
