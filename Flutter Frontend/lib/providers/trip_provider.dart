import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/dummy_data.dart';
import '../models/activity.dart';
import '../models/city.dart';
import '../models/trip.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';

/// State for trips and travel exploration
class TripState {
  final List<Trip> trips;
  final List<City> cities;
  final List<Activity> activities;
  final String? selectedTripId;
  final String searchQuery;
  final String selectedCategory;
  final bool isLoading;

  const TripState({
    this.trips = const [],
    this.cities = const [],
    this.activities = const [],
    this.selectedTripId,
    this.searchQuery = '',
    this.selectedCategory = 'All',
    this.isLoading = false,
  });

  TripState copyWith({
    List<Trip>? trips,
    List<City>? cities,
    List<Activity>? activities,
    String? selectedTripId,
    String? searchQuery,
    String? selectedCategory,
    bool? isLoading,
  }) {
    return TripState(
      trips: trips ?? this.trips,
      cities: cities ?? this.cities,
      activities: activities ?? this.activities,
      selectedTripId: selectedTripId ?? this.selectedTripId,
      searchQuery: searchQuery ?? this.searchQuery,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  Trip? get currentTrip {
    if (selectedTripId == null) {
      return trips.isNotEmpty ? trips.first : null;
    }
    return trips.firstWhere(
      (t) => t.id == selectedTripId,
      orElse: () => trips.isNotEmpty ? trips.first : DummyData.dummyTrips.first,
    );
  }

  List<Trip> get upcomingTrips =>
      trips.where((t) => t.status == TripStatus.upcoming).toList();

  List<Trip> get completedTrips =>
      trips.where((t) => t.status == TripStatus.completed).toList();

  Trip? findTripById(String id) {
    try {
      return trips.firstWhere((t) => t.id == id);
    } catch (_) {
      return null;
    }
  }

  City? findCityById(String id) {
    try {
      return cities.firstWhere((c) => c.id == id);
    } catch (_) {
      return null;
    }
  }

  List<City> get filteredCities {
    if (searchQuery.isEmpty && selectedCategory == 'All') {
      return cities;
    }
    return cities.where((c) {
      final matchesQuery = c.name.toLowerCase().contains(searchQuery.toLowerCase()) ||
          c.country.toLowerCase().contains(searchQuery.toLowerCase());
      final matchesCategory = selectedCategory == 'All' || c.tag.toLowerCase() == selectedCategory.toLowerCase();
      return matchesQuery && matchesCategory;
    }).toList();
  }
}

/// State notifier managing trips and exploration
class TripNotifier extends StateNotifier<TripState> {
  final ApiService _apiService;

  TripNotifier(this._apiService)
      : super(
          TripState(
            trips: DummyData.dummyTrips,
            cities: DummyData.dummyCities,
            activities: DummyData.dummyActivities,
            selectedTripId: DummyData.dummyTrips.first.id,
          ),
        ) {
    _loadFromBackend();
  }

  /// Load cities and trips from the backend, fall back to dummy data on failure
  Future<void> _loadFromBackend() async {
    state = state.copyWith(isLoading: true);
    try {
      final cities = await _apiService.getCities();
      if (cities.isNotEmpty) {
        state = state.copyWith(cities: cities);
      }
    } catch (_) {
      // Keep dummy cities on error
    }

    try {
      final trips = await _apiService.getTrips();
      if (trips.isNotEmpty) {
        state = state.copyWith(
          trips: trips,
          selectedTripId: trips.first.id,
        );
      }
    } catch (_) {
      // Keep dummy trips on error
    }

    state = state.copyWith(isLoading: false);
  }

  /// Refresh data from backend (call after login)
  Future<void> refresh() => _loadFromBackend();

  void selectTrip(String tripId) {
    state = state.copyWith(selectedTripId: tripId);
  }

  void updateSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
  }

  void updateCategory(String category) {
    state = state.copyWith(selectedCategory: category);
  }

  void addTrip(Trip trip) {
    state = state.copyWith(trips: [trip, ...state.trips]);
  }

  Trip? findTripById(String id) {
    try {
      return state.trips.firstWhere((t) => t.id == id);
    } catch (_) {
      return null;
    }
  }

  City? findCityById(String id) {
    try {
      return state.cities.firstWhere((c) => c.id == id);
    } catch (_) {
      return null;
    }
  }

  List<Activity> getActivitiesForCity(String cityId) {
    final list = state.activities.where((a) => a.cityId == cityId).toList();
    if (list.isNotEmpty) return list;
    return DummyData.dummyActivities;
  }
}

/// Global Trip Provider — uses the shared ApiService instance
final tripProvider = StateNotifierProvider<TripNotifier, TripState>((ref) {
  final api = ref.watch(apiServiceProvider);
  return TripNotifier(api);
});
