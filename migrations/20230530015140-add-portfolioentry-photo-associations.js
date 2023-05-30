'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable(
        "PortfolioEntryPhotos",
        {
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            PortfolioEntryId: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            PhotoId: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
        }
    );
  },

  async down (queryInterface, Sequelize) {
      return queryInterface.dropTable("PortfolioEntryPhotos");
  }
};
