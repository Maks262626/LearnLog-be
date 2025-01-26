'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [[{ id: subjectId }]] = await queryInterface.sequelize.query('SELECT id FROM subjects LIMIT 1;');
    await queryInterface.bulkInsert('assignments', [
      {
        id: uuidv4(),
        name: 'Assignment 1',
        description: 'Complete the introduction to programming tasks.',
        due_date: '2025-02-01',
        subject_id: subjectId, 
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Assignment 2',
        description: 'Write a report on database normalization.',
        due_date: '2025-02-15',
        subject_id: subjectId, 
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('assignments', null, {});
  },
};
