import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ItineraryItem = sequelize.define('ItineraryItem', {
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
  trip_stop_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trip_stops',
      key: 'id'
    }
  },
  activity_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'activities',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '10:00'
  },
  end_time: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '12:00'
  },
  item_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'itinerary_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default ItineraryItem;
