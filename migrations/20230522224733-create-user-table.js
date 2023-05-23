'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4
      },
      nome: {
          type: Sequelize.STRING,
          allowNull: false
      },
      email: {
          type: Sequelize.STRING,
          allowNull: false
      },
      senha: {
          type: Sequelize.STRING,
          allowNull: false
      }
  });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
