import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SavedDestination = sequelize.define('SavedDestination', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  city_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cities',
      key: 'id'
    }
  }
}, {
  tableName: 'saved_destinations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'city_id']
    }
  ]
});

export default SavedDestination;
