'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [[{ id: scheduleId }]] = await queryInterface.sequelize.query(
      'SELECT id FROM subject_schedules LIMIT 1;'
    );

    await queryInterface.bulkInsert('subject_instances', [
      {
        id: uuidv4(),
        name: 'Introduction to Algorithms',
        type: 'lecture',
        status: 'pending',
        location: 'Room 101',
        url: 'https://example.com/lecture-link',
        schedule_id: scheduleId,
        date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Data Structures Workshop',
        type: 'practice',
        status: 'completed',
        location: 'Lab 3',
        url: 'https://example.com/practice-link',
        schedule_id: scheduleId,
        date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('subject_instances', null, {});
  },
};
