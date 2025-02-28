const sequelize = require('../config/database');
const User = require('./UserModel');
const Attendance = require('./Attendanc');

const db = {
  sequelize,
  User,
  Attendance,
};

module.exports = db;
