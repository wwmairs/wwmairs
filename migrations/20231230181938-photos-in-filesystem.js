'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      return Promise.all([
        // remove data column
        // add path to file
        queryInterface.removeColumn('Photos', 'bytes'),
        queryInterface.addColumn(
            'Photos',
            'path',
            {
                type: Sequelize.STRING
            }
        ),

      ]);
  },

  async down (queryInterface, Sequelize) {
      return Promise.all([
        // re-add data column
        // remove path to file
        queryInterface.addColumn(
            'Photos',
            'bytes',
            {
                type: Sequelize.BLOB
            }
        ),
        queryInterface.removeColumn('Photos', 'path'),
      ]);
  }
};
