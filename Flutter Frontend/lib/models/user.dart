/// User model representing a traveler
class User {
  final String id;
  final String name;
  final String email;
  final String avatarUrl;
  final String bio;
  final int tripsCount;
  final int countriesCount;
  final int citiesCount;
  final double travelScore;

  const User({
    required this.id,
    required this.name,
    required this.email,
    required this.avatarUrl,
    this.bio = 'Passionate wanderer & cultural explorer.',
    this.tripsCount = 8,
    this.countriesCount = 14,
    this.citiesCount = 28,
    this.travelScore = 850,
  });

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? avatarUrl,
    String? bio,
    int? tripsCount,
    int? countriesCount,
    int? citiesCount,
    double? travelScore,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      bio: bio ?? this.bio,
      tripsCount: tripsCount ?? this.tripsCount,
      countriesCount: countriesCount ?? this.countriesCount,
      citiesCount: citiesCount ?? this.citiesCount,
      travelScore: travelScore ?? this.travelScore,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'avatarUrl': avatarUrl,
      'bio': bio,
      'tripsCount': tripsCount,
      'countriesCount': countriesCount,
      'citiesCount': citiesCount,
      'travelScore': travelScore,
    };
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      avatarUrl: json['avatarUrl'] as String? ?? '',
      bio: json['bio'] as String? ?? '',
      tripsCount: (json['tripsCount'] as num?)?.toInt() ?? 0,
      countriesCount: (json['countriesCount'] as num?)?.toInt() ?? 0,
      citiesCount: (json['citiesCount'] as num?)?.toInt() ?? 0,
      travelScore: (json['travelScore'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
