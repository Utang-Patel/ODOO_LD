import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TripStop = sequelize.define('TripStop', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  trip_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trips',
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
  },
  arrival_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  departure_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  stop_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'trip_stops',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default TripStop;
