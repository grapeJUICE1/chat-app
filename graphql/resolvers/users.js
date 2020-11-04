const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { JWT_SECRET } = require("../../config/env.json");
const { User, Message } = require("../../models");

module.exports = {
  Query: {
    getUsers: async (parent, args, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const users = await User.findAll({
          attributes: ["username", "imageUrl", "createdAt"],
          where: { username: { [Op.ne]: user.username } },
        });

        const allUserMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }],
          },
          order: [["createdAt", "DESC"]],
        });

        const users2 = users.map((otherUser) => {
          const latestMessage = allUserMessages.find(
            (m) => m.from === otherUser.username || m.to === otherUser.username
          );
          otherUser.latestMessage = latestMessage;
          return otherUser;
        });

        return users2;
      } catch (err) {
        console.log(err);
        if (err.message == "invalid token") {
          throw new UserInputError("Unauthenticated");
        } else {
          throw err;
        }
      }
    },
    login: async (parent, args) => {
      const { username, password } = args;
      let errors = {};
      try {
        if (username.trim() === "") errors.username = "Username Can't be empty";
        if (password.trim() === "") errors.password = "password Can't be empty";
        if (Object.keys(errors).length > 0)
          throw new UserInputError("bad input", {
            errors,
          });
        const user = await User.findOne({ where: { username } });
        if (!user) {
          errors.username = "user not found";
          throw new UserInputError("user not found", { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new UserInputError("password is incorrect", { errors });
        }
        const token = await promisify(jwt.sign)({ username }, JWT_SECRET, {
          expiresIn: "24h",
          // 259200000
        });

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (parent, args, context, info) => {
      let { username, email, password, confirmPassword, imageUrl } = args;
      let errors = {};
      try {
        if (username.trim() === "") errors.username = "Username Can't be empty";
        if (email.trim() === "") errors.email = "Email Can't be empty";
        if (password.trim() === "") errors.password = "Password Can't be empty";
        if (imageUrl.trim() === "")
          imageUrl =
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "Retyped Password Can't be empty";
        if (password != confirmPassword)
          errors.confirmPassword = "Passwords must match";

        // const userByUsername = await User.findOne({ where: { username } });
        // const userByEmail = await User.findOne({ where: { email } });

        // if (userByUsername) errors.username = "Username already taken";
        // if (userByEmail) errors.email = "email already taken";

        if (Object.keys(errors).length > 0) throw errors;

        password = await bcrypt.hash(password, 12);
        const user = await User.create({
          username,
          email,
          password,
          imageUrl:
            imageUrl.trim() === ""
              ? "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              : imageUrl,
        });
        return user;
      } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          );
        } else if (err.name == "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad Input", { errors });
      }
    },
  },
};
