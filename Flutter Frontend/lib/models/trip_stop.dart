import 'activity.dart';
import 'city.dart';

/// TripStop model representing a single city destination stop within a multi-city trip
class TripStop {
  final String id;
  final City city;
  final DateTime arrivalDate;
  final DateTime departureDate;
  final List<Activity> activities;
  final double budget;
  final String hotelName;
  final String transportMode;

  const TripStop({
    required this.id,
    required this.city,
    required this.arrivalDate,
    required this.departureDate,
    this.activities = const [],
    this.budget = 500.0,
    this.hotelName = '',
    this.transportMode = 'Flight',
  });

  int get daysCount => departureDate.difference(arrivalDate).inDays + 1;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'city': city.toJson(),
      'arrivalDate': arrivalDate.toIso8601String(),
      'departureDate': departureDate.toIso8601String(),
      'activities': activities.map((a) => a.toJson()).toList(),
      'budget': budget,
      'hotelName': hotelName,
      'transportMode': transportMode,
    };
  }

  factory TripStop.fromJson(Map<String, dynamic> json) {
    return TripStop(
      id: (json['id'] ?? '').toString(),
      city: City.fromJson((json['City'] ?? json['city'] ?? {}) as Map<String, dynamic>),
      arrivalDate: DateTime.tryParse(json['arrival_date'] as String? ?? json['arrivalDate'] as String? ?? '') ?? DateTime.now(),
      departureDate: DateTime.tryParse(json['departure_date'] as String? ?? json['departureDate'] as String? ?? '') ?? DateTime.now(),
      activities: (json['Activities'] as List<dynamic>? ?? json['activities'] as List<dynamic>?)
              ?.map((e) => Activity.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      budget: (json['budget'] as num?)?.toDouble() ?? 0.0,
      hotelName: json['hotel_name'] as String? ?? json['hotelName'] as String? ?? '',
      transportMode: json['transport_mode'] as String? ?? json['transportMode'] as String? ?? 'Flight',
    );
  }
}
