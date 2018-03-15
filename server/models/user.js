'use strict';
module.exports = (sequelize, DataTypes) => {
    var user = sequelize.define('user', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        version: DataTypes.INTEGER
    });

    user.associate = (models) => {
        console.log('association made');
    }

    return user;
};