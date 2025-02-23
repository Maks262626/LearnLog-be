'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [[{ id: userId }]] = await queryInterface.sequelize.query('SELECT id FROM users LIMIT 1;');
    const [[{ id: subjectInstanceId }]] = await queryInterface.sequelize.query('SELECT id FROM subject_instances LIMIT 1;');

    await queryInterface.bulkInsert('attendances', [
      {
        id: uuidv4(),
        status: 'present',
        user_id: userId,
        subject_instance_id: subjectInstanceId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        status: 'absent',
        user_id: userId,
        subject_instance_id: subjectInstanceId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        status: 'late',
        user_id: userId,
        subject_instance_id: subjectInstanceId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('attendances', null, {});
  },
};
