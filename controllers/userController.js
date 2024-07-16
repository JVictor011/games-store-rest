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

  async register(req, res) {
    try {
      const { email, username, password } = req.params;

      const getFindByEmail = await userService.getFindByEmail(email);
      if (getFindByEmail) {
        res.status(400).json({ error: "Email already registered" });
      }

      const usernameIsValid = await userService.getFindByUsername(username);
      if (usernameIsValid) {
        res.status(400).json({ error: "Username already taken" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const user = await userService.createUser({
        email,
        username,
        password: hashedPassword,
      });

      if (user) {
        res.status(201).json({ message: "User registered successfully" });
      } else {
        res.status(500).json({ error: "Failed to register user" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
