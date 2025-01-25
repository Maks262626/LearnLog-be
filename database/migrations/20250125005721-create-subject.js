'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('subjects', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      desciption: {
        type: Sequelize.STRING,
        allowNull: true, 
      },
      type: {
        type: Sequelize.ENUM('exam', 'credit'),
        allowNull: false,
      },
      group_id: {
        type: Sequelize.UUID,
        references: {
          model: 'groups', 
          key: 'id', 
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', 
      },
      teacher_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', 
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('subjects');
  },
};
