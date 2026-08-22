import 'activity.dart';

/// Daily scheduled item within an itinerary day
class ItineraryItem {
  final String id;
  final int dayNumber;
  final String timeSlot;
  final String title;
  final String description;
  final String location;
  final double cost;
  final String category;
  final Activity? activity;
  final bool isCompleted;

  const ItineraryItem({
    required this.id,
    required this.dayNumber,
    required this.timeSlot,
    required this.title,
    this.description = '',
    this.location = '',
    this.cost = 0.0,
    this.category = 'Activity',
    this.activity,
    this.isCompleted = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'dayNumber': dayNumber,
      'timeSlot': timeSlot,
      'title': title,
      'description': description,
      'location': location,
      'cost': cost,
      'category': category,
      'activity': activity?.toJson(),
      'isCompleted': isCompleted,
    };
  }

  factory ItineraryItem.fromJson(Map<String, dynamic> json) {
    return ItineraryItem(
      id: (json['id'] ?? '').toString(),
      dayNumber: (json['day_number'] as num?)?.toInt() ?? (json['dayNumber'] as num?)?.toInt() ?? 1,
      timeSlot: json['time_slot'] as String? ?? json['timeSlot'] as String? ?? '09:00 AM',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      location: json['location'] as String? ?? '',
      cost: (json['cost'] as num?)?.toDouble() ?? 0.0,
      category: json['category'] as String? ?? 'Activity',
      activity: (json['Activity'] != null || json['activity'] != null)
          ? Activity.fromJson((json['Activity'] ?? json['activity']) as Map<String, dynamic>)
          : null,
      isCompleted: json['is_completed'] as bool? ?? json['isCompleted'] as bool? ?? false,
    );
  }
}
