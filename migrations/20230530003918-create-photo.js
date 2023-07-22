'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Photos', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUIDV4
      },
      portfolioEntryId: {
          type: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING
      },
      originalname: {
        type: Sequelize.STRING
      },
      bytes: {
        type: Sequelize.BLOB
      },
      encoding: {
        type: Sequelize.STRING
      },
      mimetype: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Photos');
  }
};
