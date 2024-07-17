require("dotenv").config();
const UserRepository = require("../repositories/userRepository");
const UserService = require("../services/userService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const JWTSecret = process.env.JWT_SECRET;

class UserController {
  static passwordValidation(password) {
    const requirements = {
      minLength: password.length >= 8,
      lowerCase: /[a-z]/.test(password),
      upperCase: /[A-Z]/.test(password),
      digit: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };

    const unmetRequirements = Object.keys(requirements).filter(
      (key) => !requirements[key]
    );

    return {
      isValid: unmetRequirements.length === 0,
      unmetRequirements,
    };
  }

  static isFieldValid(field) {
    return field !== null && field !== undefined && field.trim() !== "";
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;
    return email.match(emailRegex) !== null;
  }

  async authentication(req, res) {
    try {
      const { email, password } = req.body;

      if (email == undefined || password == undefined)
        res.status(400).json({ error: "Missing email or password" });

      const user = await userService.getFindByEmail(email);
      if (!user) res.status(401).json({ error: "Invalid email or password" });

      const correct = bcrypt.compareSync(password, user.password);
      if (!correct)
        res.status(401).json({ error: "Invalid email or password" });

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
      if (getFindByEmail)
        res.status(400).json({ error: "Email already registered" });

      if (!UserController.isValidEmail(username))
        res.status(400).json({ error: "Invalid email" });

      const usernameIsValid = await userService.getFindByUsername(username);
      if (usernameIsValid)
        res.status(400).json({ error: "Username already taken" });

      if (!UserController.isFieldValid(username))
        res.status(400).json({ error: "Invalid username" });

      if (!UserController.passwordValidation(password)) {
        res.status(400).json({
          error:
            "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
        });
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

  validatePassword(req, res) {
    const { password } = req.body;
    const validationResult = UserController.passwordValidation(password);
    res.json(validationResult);
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { email, username, password } = req.body;

      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
      }

      const updatedData = {
        email: user.email,
        username: user.username,
        password: user.password,
      };

      if (UserController.isValidEmail(email) && email !== user.email) {
        const emailExists = await userService.getFindByEmail(email);
        if (emailExists) {
          return res.status(400).json({ error: "Email already registered" });
        }
        updatedData.email = email;
      }

      if (UserController.isFieldValid(username) && username !== user.username) {
        const usernameExists = await userService.getFindByUsername(username);
        if (usernameExists) {
          return res.status(400).json({ error: "Username already taken" });
        }
        updatedData.username = username;
      }

      if (UserController.passwordValidation(password)) {
        const isSamePassword = bcrypt.compareSync(password, user.password);
        if (!isSamePassword) {
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(password, salt);
          updatedData.password = hashedPassword;
        }
      }

      const updatedUser = await userService.updateUser(
        id,
        updatedData.username
      );
      if (updatedUser) {
        return res
          .status(200)
          .json({ message: "User updated successfully", user: updatedUser });
      } else {
        return res.status(500).json({ error: "Failed to update user" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
