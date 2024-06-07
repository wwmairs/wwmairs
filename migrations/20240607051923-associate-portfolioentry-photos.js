'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
          queryInterface.removeColumn("photos", "order"),
        ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
          queryInterface.addColumn(
                "Photos",
                "order",
                {
                    type: Sequelize.INTEGER
                }
            )
        ]);
  }
};
