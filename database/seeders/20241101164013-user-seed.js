'use strict';

const { v4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        id: v4(),
        auth0_user_id: 'auth0|1234567890abcdef',
        first_name: 'John',
        last_name: 'Doe',
        is_registration_completed: true,
        university_id: null,
        faculty_id: null,
        group_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: v4(),
        auth0_user_id: 'auth0|abcdef1234567890',
        first_name: 'Jane',
        last_name: 'Smith',
        is_registration_completed: false,
        university_id: null,
        faculty_id: null,
        group_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
