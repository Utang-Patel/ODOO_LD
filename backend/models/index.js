import sequelize from '../config/database.js';
import User from './User.js';
import Trip from './Trip.js';
import City from './City.js';
import Activity from './Activity.js';
import TripStop from './TripStop.js';
import ItineraryItem from './ItineraryItem.js';
import Expense from './Expense.js';
import SavedDestination from './SavedDestination.js';

// User <-> Trip
User.hasMany(Trip, { foreignKey: 'user_id', as: 'trips', onDelete: 'CASCADE' });
Trip.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Trip <-> TripStop <-> City
Trip.hasMany(TripStop, { foreignKey: 'trip_id', as: 'stops', onDelete: 'CASCADE' });
TripStop.belongsTo(Trip, { foreignKey: 'trip_id', as: 'trip' });

City.hasMany(TripStop, { foreignKey: 'city_id', as: 'stops' });
TripStop.belongsTo(City, { foreignKey: 'city_id', as: 'city' });

// City <-> Activity
City.hasMany(Activity, { foreignKey: 'city_id', as: 'activities', onDelete: 'CASCADE' });
Activity.belongsTo(City, { foreignKey: 'city_id', as: 'city' });

// Trip / TripStop / Activity <-> ItineraryItem
Trip.hasMany(ItineraryItem, { foreignKey: 'trip_id', as: 'itineraryItems', onDelete: 'CASCADE' });
ItineraryItem.belongsTo(Trip, { foreignKey: 'trip_id', as: 'trip' });

TripStop.hasMany(ItineraryItem, { foreignKey: 'trip_stop_id', as: 'itineraryItems', onDelete: 'CASCADE' });
ItineraryItem.belongsTo(TripStop, { foreignKey: 'trip_stop_id', as: 'tripStop' });

Activity.hasMany(ItineraryItem, { foreignKey: 'activity_id', as: 'itineraryItems' });
ItineraryItem.belongsTo(Activity, { foreignKey: 'activity_id', as: 'activity' });

// Trip <-> Expense
Trip.hasMany(Expense, { foreignKey: 'trip_id', as: 'expenses', onDelete: 'CASCADE' });
Expense.belongsTo(Trip, { foreignKey: 'trip_id', as: 'trip' });

// User <-> SavedDestination <-> City
User.hasMany(SavedDestination, { foreignKey: 'user_id', as: 'savedDestinations', onDelete: 'CASCADE' });
SavedDestination.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

City.hasMany(SavedDestination, { foreignKey: 'city_id', as: 'savedDestinations', onDelete: 'CASCADE' });
SavedDestination.belongsTo(City, { foreignKey: 'city_id', as: 'city' });

export {
  sequelize,
  User,
  Trip,
  City,
  Activity,
  TripStop,
  ItineraryItem,
  Expense,
  SavedDestination
};
