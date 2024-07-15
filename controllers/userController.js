require("dotenv").config();
const UserRepository = require("../repositories/userRepository");
const UserService = require("../services/userService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const JWTSecret = process.env.JWT_SECRET;

class UserController {
  async authentication(req, res) {
    try {
      const { email, password } = req.body;

      if (email == undefined || password == undefined) {
        res.status(400).json({ error: "Missing email or password" });
      }

      const user = await userService.getFindByEmail(email);
      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
      }

      const correct = bcrypt.compareSync(password, user.password);
      if (!correct) {
        res.status(401).json({ error: "Invalid email or password" });
      }

      jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        JWTSecret,
        { expiresIn: "48h" },
        (err, token) => {
          if (!err) {
            res.status(200).json({ message: "Login successful", token: token });
          } else {
            res.status(400).json({ error: "Invalid token" });
          }
        }
      );

      res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
