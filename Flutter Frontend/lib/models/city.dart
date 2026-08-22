/// City model representing a travel destination
class City {
  final String id;
  final String name;
  final String country;
  final String imageUrl;
  final double rating;
  final String description;
  final String tag;
  final double avgCostPerDay;
  final String currency;
  final double latitude;
  final double longitude;
  final bool isTrending;

  const City({
    required this.id,
    required this.name,
    required this.country,
    required this.imageUrl,
    this.rating = 4.8,
    this.description = '',
    this.tag = 'Popular',
    this.avgCostPerDay = 150.0,
    this.currency = 'USD',
    this.latitude = 0.0,
    this.longitude = 0.0,
    this.isTrending = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'country': country,
      'imageUrl': imageUrl,
      'rating': rating,
      'description': description,
      'tag': tag,
      'avgCostPerDay': avgCostPerDay,
      'currency': currency,
      'latitude': latitude,
      'longitude': longitude,
      'isTrending': isTrending,
    };
  }

  factory City.fromJson(Map<String, dynamic> json) {
    return City(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      country: json['country'] as String? ?? '',
      imageUrl: json['imageUrl'] as String? ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 4.5,
      description: json['description'] as String? ?? '',
      tag: json['tag'] as String? ?? 'Popular',
      avgCostPerDay: (json['avgCostPerDay'] as num?)?.toDouble() ?? 100.0,
      currency: json['currency'] as String? ?? 'USD',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      isTrending: json['isTrending'] as bool? ?? false,
    );
  }
}
