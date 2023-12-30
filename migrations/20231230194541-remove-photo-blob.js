'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      return Promise.all([
        queryInterface.removeColumn('Photos', 'bytes'),
      ]);
  },

  async down (queryInterface, Sequelize) {
      return Promise.all([
        queryInterface.addColumn(
            'Photos',
            'bytes',
            {
                type: Sequelize.BLOB
            }
        ),
      ]);
  }
};
