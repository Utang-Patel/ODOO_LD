/// Expense item model for trip budget tracking
class Expense {
  final String id;
  final String tripId;
  final String title;
  final double amount;
  final String category; // 'Flights', 'Stays', 'Food', 'Activities', 'Transport', 'Other'
  final DateTime date;
  final String paymentMethod;
  final String notes;

  const Expense({
    required this.id,
    required this.tripId,
    required this.title,
    required this.amount,
    required this.category,
    required this.date,
    this.paymentMethod = 'Credit Card',
    this.notes = '',
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tripId': tripId,
      'title': title,
      'amount': amount,
      'category': category,
      'date': date.toIso8601String(),
      'paymentMethod': paymentMethod,
      'notes': notes,
    };
  }

  factory Expense.fromJson(Map<String, dynamic> json) {
    return Expense(
      id: (json['id'] ?? '').toString(),
      tripId: (json['trip_id'] ?? json['tripId'] ?? '').toString(),
      title: json['title'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      category: json['category'] as String? ?? 'Other',
      date: DateTime.tryParse(json['date'] as String? ?? '') ?? DateTime.now(),
      paymentMethod: json['payment_method'] as String? ?? json['paymentMethod'] as String? ?? 'Credit Card',
      notes: json['notes'] as String? ?? '',
    );
  }
}
