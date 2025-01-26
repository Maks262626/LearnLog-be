'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('student_submissions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      submission_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      student_comments: {
        type: Sequelize.STRING,
        allowNull: true, 
      },
      status: {
        type: Sequelize.ENUM(
          'pending',
          'reviewed',
          'graded',
          'resubmission_requested',
          'late_submission'
        ),
        allowNull: false,
      },
      assignment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'assignments', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('student_submissions');
  },
};
