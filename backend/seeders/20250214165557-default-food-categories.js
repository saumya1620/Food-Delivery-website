'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('FoodCategories', [
      {
        name: 'Salad',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(), 
      },
      {
        name: 'Rolls',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dessert',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sandwich',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cake',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pasta',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Noodles',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Burgers',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Coffee',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Juice',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Snacks',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Chinese',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Italian',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mexican',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cakes',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sweets',
        imagePath: ' ',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('FoodCategories', null, {});
  }
};
