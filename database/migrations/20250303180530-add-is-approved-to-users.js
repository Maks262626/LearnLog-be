
export async function up(queryInterface,Sequelize) {
  return queryInterface.addColumn('users', 'is_approved', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false, 
  });
}

export async function down(queryInterface) {
  return queryInterface.removeColumn('users', 'is_approved');
}
