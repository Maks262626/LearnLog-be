'use strict';

const { v4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [[{ id: subjectId }]] = await queryInterface.sequelize.query('SELECT id FROM subjects LIMIT 1;');
    const [[{ id: userId }]] = await queryInterface.sequelize.query('SELECT id FROM users LIMIT 1;');

    await queryInterface.bulkInsert('final_grades', [
      {
        id: v4(),
        final_grade: 85,
        exam_grade: 90,
        subject_id: subjectId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: v4(),
        final_grade: 78,
        exam_grade: null,
        subject_id: subjectId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: v4(),
        final_grade: 92,
        exam_grade: 95,
        subject_id: subjectId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('final_grades', null, {});
  },
};
