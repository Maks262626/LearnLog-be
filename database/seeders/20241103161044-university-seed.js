'use strict';

const { v4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('universities', [
      {
        id: v4(), 
        name: 'Harvard University',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: v4(),
        name: 'Stanford University',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: v4(),
        name: 'MIT',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('universities', null, {});
  },
};
