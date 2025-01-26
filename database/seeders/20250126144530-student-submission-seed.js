'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [[{ id: assignmentId }]] = await queryInterface.sequelize.query('SELECT id FROM assignments LIMIT 1;');
    const [[{ id: userId }]] = await queryInterface.sequelize.query('SELECT id FROM users LIMIT 1;');

    await queryInterface.bulkInsert('student_submissions', [
      {
        id: uuidv4(),
        file_url: 'https://example.com/files/submission1.pdf',
        submission_date: '2025-02-02',
        student_comments: 'Please review my assignment.',
        status: 'pending',
        assignment_id: assignmentId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        file_url: 'https://example.com/files/submission2.pdf',
        submission_date: '2025-02-16',
        student_comments: 'Apologies for the late submission.',
        status: 'late_submission',
        assignment_id: assignmentId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        file_url: 'https://example.com/files/submission3.pdf',
        submission_date: '2025-02-18',
        student_comments: null,
        status: 'graded',
        assignment_id: assignmentId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('student_submissions', null, {});
  },
};
