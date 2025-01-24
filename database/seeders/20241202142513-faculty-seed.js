'use strict';

const { v4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const [[{id:uniId}]] = await queryInterface.sequelize.query('SELECT id FROM universities LIMIT 1;');
   
    await queryInterface.bulkInsert('faculties',[
      {
        id: v4(),
        name: 'FIZMAT',
        university_id: uniId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: v4(),
        name: 'MATINF',
        university_id: uniId,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('faculties',null,{})
  }
};
