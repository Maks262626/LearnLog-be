'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [[{ id: assignmentId }]] = await queryInterface.sequelize.query('SELECT id FROM assignments LIMIT 1;');
    const [[{ id: userId }]] = await queryInterface.sequelize.query('SELECT id FROM users LIMIT 1;');

    await queryInterface.bulkInsert('grades', [
      {
        id: uuidv4(),
        grade_value: 85,
        assignment_id: assignmentId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        grade_value: 92,
        assignment_id: assignmentId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        grade_value: 75,
        assignment_id: assignmentId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('grades', null, {});
  },
};
