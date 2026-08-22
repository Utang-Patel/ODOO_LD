/// Activity model representing an excursion, tour, or experience
class Activity {
  final String id;
  final String cityId;
  final String name;
  final String category;
  final double price;
  final String duration;
  final double rating;
  final int reviewsCount;
  final String imageUrl;
  final String description;
  final String location;
  final bool isFeatured;

  const Activity({
    required this.id,
    required this.cityId,
    required this.name,
    required this.category,
    required this.price,
    required this.duration,
    this.rating = 4.8,
    this.reviewsCount = 120,
    required this.imageUrl,
    this.description = '',
    this.location = '',
    this.isFeatured = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'cityId': cityId,
      'name': name,
      'category': category,
      'price': price,
      'duration': duration,
      'rating': rating,
      'reviewsCount': reviewsCount,
      'imageUrl': imageUrl,
      'description': description,
      'location': location,
      'isFeatured': isFeatured,
    };
  }

  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      id: json['id'] as String? ?? '',
      cityId: json['cityId'] as String? ?? '',
      name: json['name'] as String? ?? '',
      category: json['category'] as String? ?? 'General',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      duration: json['duration'] as String? ?? '2 hours',
      rating: (json['rating'] as num?)?.toDouble() ?? 4.5,
      reviewsCount: (json['reviewsCount'] as num?)?.toInt() ?? 0,
      imageUrl: json['imageUrl'] as String? ?? '',
      description: json['description'] as String? ?? '',
      location: json['location'] as String? ?? '',
      isFeatured: json['isFeatured'] as bool? ?? false,
    );
  }
}
