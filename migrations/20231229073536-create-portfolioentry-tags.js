'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PortfolioEntry_Tags', {
      PortfolioEntryId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUIDV4,
      },
      tagId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUIDV4
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
    await queryInterface.dropTable('PortfolioEntry_Tags');
  }
};