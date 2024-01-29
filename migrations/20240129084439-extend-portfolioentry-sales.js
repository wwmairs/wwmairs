'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                "PortfolioEntries",
                "selling",
                {
                    type: Sequelize.BOOLEAN
                }
            ),
            queryInterface.addColumn(
                "PortfolioEntries",
                "price",
                {
                    type: Sequelize.FLOAT
                }
            ),
            queryInterface.addColumn(
                "PortfolioEntries",
                "edition",
                {
                    type: Sequelize.INTEGER
                }
            ),
            queryInterface.addColumn(
                "PortfolioEntries",
                "available",
                {
                    type: Sequelize.INTEGER
                }
            )
        ]);
    },
  
    async down (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn("PortfolioEntries", "selling"),
            queryInterface.removeColumn("PortfolioEntries", "price"),
            queryInterface.removeColumn("PortfolioEntries", "edition"),
            queryInterface.removeColumn("PortfolioEntries", "available")
        ]);
    }
};
