'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [[{ id: subjectId }]] = await queryInterface.sequelize.query('SELECT id FROM subjects LIMIT 1;');
    await queryInterface.bulkInsert('subject_schedules', [
      {
        id: uuidv4(),
        start_date: '2025-02-01',
        start_time: '09:30',
        end_date: '2025-05-31',
        end_time: '11:30',
        day_of_week_mask: '1,3,5', 
        instanse_count: 30,
        default_url: 'https://example.com/lesson-link',
        subject_id: subjectId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        start_date: '2025-02-01',
        start_time: '14:00',
        end_date: '2025-05-31',
        end_time: '15:30',
        day_of_week_mask: '2,4',
        instanse_count: 20,
        default_url: 'https://example.com/lesson-link-2',
        subject_id: subjectId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('subject_schedules', null, {});
  },
};
