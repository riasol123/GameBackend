module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true,
          notNull: true,
        },
        unique: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        },
        type: Sequelize.STRING,
      },
      progress: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  },
};
