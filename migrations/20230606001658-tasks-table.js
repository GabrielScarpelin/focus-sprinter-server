"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable(
      "tasks",
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },
        nomeMateria: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        tempo: {
          type: Sequelize.NUMBER,
          allowNull: false,
        },
        rendimentoQuest: {
          type: Sequelize.NUMBER,
          allowNull: true,
        },
        questionsTodo: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        userId: {
          type: Sequelize.UUIDV4,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
      },
      {
        timestamps: false,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("tasks");
  },
};
