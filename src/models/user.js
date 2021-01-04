import Sequelize from 'sequelize';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      number: {
        field: 'number',
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        field: 'email',
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        field: 'password',
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      salt: {
        field: 'salt',
        type: DataTypes.STRING(255),
        allowNull: false,
      }
    },
    {
      tableName: 'user',
      timestamps: false,
    },
  );

  User.associate = models => {
    console.log(`User\nAssociate list\nNone\n`);
  }

  return User;
}