import 'expense.dart';
import 'itinerary_item.dart';
import 'trip_stop.dart';

/// Status of a trip
enum TripStatus {
  planning,
  upcoming,
  ongoing,
  completed,
}

/// Trip model representing a customized multi-city trip
class Trip {
  final String id;
  final String title;
  final String description;
  final String coverImageUrl;
  final DateTime startDate;
  final DateTime endDate;
  final double budget;
  final double spent;
  final String currency;
  final TripStatus status;
  final List<TripStop> stops;
  final List<ItineraryItem> itineraryItems;
  final List<Expense> expenses;
  final bool isPublic;
  final String createdBy;
  final int travelersCount;

  const Trip({
    required this.id,
    required this.title,
    required this.description,
    required this.coverImageUrl,
    required this.startDate,
    required this.endDate,
    this.budget = 3000.0,
    this.spent = 1850.0,
    this.currency = 'USD',
    this.status = TripStatus.upcoming,
    this.stops = const [],
    this.itineraryItems = const [],
    this.expenses = const [],
    this.isPublic = false,
    this.createdBy = 'Alex Morgan',
    this.travelersCount = 2,
  });

  int get totalDays => endDate.difference(startDate).inDays + 1;
  int get citiesCount => stops.length;
  double get remainingBudget => budget - spent;
  double get budgetProgress => budget > 0 ? (spent / budget).clamp(0.0, 1.0) : 0.0;

  Trip copyWith({
    String? id,
    String? title,
    String? description,
    String? coverImageUrl,
    DateTime? startDate,
    DateTime? endDate,
    double? budget,
    double? spent,
    String? currency,
    TripStatus? status,
    List<TripStop>? stops,
    List<ItineraryItem>? itineraryItems,
    List<Expense>? expenses,
    bool? isPublic,
    String? createdBy,
    int? travelersCount,
  }) {
    return Trip(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      coverImageUrl: coverImageUrl ?? this.coverImageUrl,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      budget: budget ?? this.budget,
      spent: spent ?? this.spent,
      currency: currency ?? this.currency,
      status: status ?? this.status,
      stops: stops ?? this.stops,
      itineraryItems: itineraryItems ?? this.itineraryItems,
      expenses: expenses ?? this.expenses,
      isPublic: isPublic ?? this.isPublic,
      createdBy: createdBy ?? this.createdBy,
      travelersCount: travelersCount ?? this.travelersCount,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'coverImageUrl': coverImageUrl,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'budget': budget,
      'spent': spent,
      'currency': currency,
      'status': status.name,
      'stops': stops.map((s) => s.toJson()).toList(),
      'itineraryItems': itineraryItems.map((i) => i.toJson()).toList(),
      'expenses': expenses.map((e) => e.toJson()).toList(),
      'isPublic': isPublic,
      'createdBy': createdBy,
      'travelersCount': travelersCount,
    };
  }

  factory Trip.fromJson(Map<String, dynamic> json) {
    return Trip(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      coverImageUrl: json['coverImageUrl'] as String? ?? '',
      startDate: DateTime.tryParse(json['startDate'] as String? ?? '') ?? DateTime.now(),
      endDate: DateTime.tryParse(json['endDate'] as String? ?? '') ?? DateTime.now(),
      budget: (json['budget'] as num?)?.toDouble() ?? 0.0,
      spent: (json['spent'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? 'USD',
      status: TripStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => TripStatus.upcoming,
      ),
      stops: (json['stops'] as List<dynamic>?)
              ?.map((e) => TripStop.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      itineraryItems: (json['itineraryItems'] as List<dynamic>?)
              ?.map((e) => ItineraryItem.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      expenses: (json['expenses'] as List<dynamic>?)
              ?.map((e) => Expense.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      isPublic: json['isPublic'] as bool? ?? false,
      createdBy: json['createdBy'] as String? ?? '',
      travelersCount: (json['travelersCount'] as num?)?.toInt() ?? 1,
    );
  }
}
