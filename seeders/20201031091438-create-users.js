"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash("123456", 6);
    const createdAt = new Date();
    const updatedAt = createdAt;

    // https://unsplash.com/photos/ZHvM3XIOHoE
    // https://unsplash.com/photos/b1Hg7QI-zcc
    // https://unsplash.com/photos/RiDxDgHg7pw

    await queryInterface.bulkInsert("Users", [
      {
        username: "tripsta",
        email: "tripsta@email.com",
        password: password,
        imageUrl:
          "https://images.unsplash.com/photo-1542838686-37da4a9fd1b3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        createdAt,
        updatedAt,
      },
      {
        username: "kadim",
        email: "kadim@email.com",
        password: password,
        imageUrl:
          "https://images.unsplash.com/photo-1541647376583-8934aaf3448a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        createdAt,
        updatedAt,
      },
      {
        username: "mushfiq",
        email: "findmushfiq@gmail.com",
        password: password,
        imageUrl:
          "https://images.unsplash.com/photo-1547624643-3bf761b09502?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        createdAt,
        updatedAt,
      },
      {
        username: "lunar",
        email: "lunar@gmail.com",
        password: password,
        imageUrl:
          "https://images.unsplash.com/photo-1600058355787-43cc6dec101c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        createdAt,
        updatedAt,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
