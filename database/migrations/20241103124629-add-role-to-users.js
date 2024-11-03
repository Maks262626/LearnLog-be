'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.Sequelize.ENUM('student', 'teacher', 'manager', 'superadmin'),
      allowNull: true, 
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'role');
  },
};
