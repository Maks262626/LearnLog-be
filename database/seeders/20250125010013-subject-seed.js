'use strict';

const { v4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [[{ id: groupId }]] = await queryInterface.sequelize.query('SELECT id FROM `groups` LIMIT 1;');
    const [[{ id: teacherId }]] = await queryInterface.sequelize.query('SELECT id FROM `users` LIMIT 1;');
    
    await queryInterface.bulkInsert('subjects', [
      {
        id: v4(),
        name: 'Mathematics',
        description: 'An introduction to algebra, calculus, and geometry.',
        type: 'exam',
        group_id: groupId,
        teacher_id: teacherId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: v4(),
        name: 'Physics',
        description: 'Learn about the laws of motion, energy, and matter.',
        type: 'credit',
        group_id: groupId,
        teacher_id: teacherId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: v4(),
        name: 'Computer Science',
        description: 'Introduction to programming and computer systems.',
        type: 'exam',
        group_id: groupId,
        teacher_id: teacherId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('subjects', null, {});
  },
};
