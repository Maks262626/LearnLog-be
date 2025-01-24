'use strict';

const { v4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [[{ id: facultyId }]] = await queryInterface.sequelize.query('SELECT id FROM faculties LIMIT 1;');

    await queryInterface.bulkInsert('groups', [
      {
        id: v4(),
        name: 'Group A',
        faculty_id: facultyId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: v4(),
        name: 'Group B',
        faculty_id: facultyId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: v4(),
        name: 'Group C',
        faculty_id: facultyId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('groups', null, {});
  }
};
