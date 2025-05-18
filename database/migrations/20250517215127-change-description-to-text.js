module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('assignments', 'description', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('assignments', 'description', {
      type: Sequelize.STRING, 
      allowNull: true,
    });
  },
};
