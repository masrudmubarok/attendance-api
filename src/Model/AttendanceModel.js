const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./UserModel');

const Attendance = sequelize.define(
  'Attendance',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    clockIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    clockOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'attendances',
    timestamps: false,
  }
);

Attendance.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Attendance, { foreignKey: 'userId' });

module.exports = Attendance;