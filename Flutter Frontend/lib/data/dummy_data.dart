import '../models/activity.dart';
import '../models/city.dart';
import '../models/expense.dart';
import '../models/itinerary_item.dart';
import '../models/trip.dart';
import '../models/trip_stop.dart';
import '../models/user.dart';

/// Realistic mock dataset for GlobeTrotter Frontend Phase 1
class DummyData {
  DummyData._();

  // Current Logged In User
  static const User dummyUser = User(
    id: 'usr-001',
    name: 'Alex Morgan',
    email: 'alex.morgan@wanderlust.io',
    avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Photographer & cultural wanderer. 24 countries explored, infinity to go ✈️📸',
    tripsCount: 8,
    countriesCount: 14,
    citiesCount: 28,
    travelScore: 920,
  );

  // Destinations / Cities
  static const List<City> dummyCities = [
    City(
      id: 'city-paris',
      name: 'Paris',
      country: 'France',
      imageUrl:
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      description: 'The City of Light, romance, iconic architecture, art, and world-class culinary masterpieces.',
      tag: 'Romantic',
      avgCostPerDay: 220.0,
      latitude: 48.8566,
      longitude: 2.3522,
      isTrending: true,
    ),
    City(
      id: 'city-zurich',
      name: 'Zurich',
      country: 'Switzerland',
      imageUrl:
          'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      description: 'Pristine alpine lakes, medieval altstadt, luxury shopping, and snow-capped mountain backdrops.',
      tag: 'Scenic',
      avgCostPerDay: 310.0,
      latitude: 47.3769,
      longitude: 8.5417,
      isTrending: false,
    ),
    City(
      id: 'city-rome',
      name: 'Rome',
      country: 'Italy',
      imageUrl:
          'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      description: 'The Eternal City with thousands of years of ancient history, Roman ruins, and gelato on every corner.',
      tag: 'Historical',
      avgCostPerDay: 180.0,
      latitude: 41.9028,
      longitude: 12.4964,
      isTrending: true,
    ),
    City(
      id: 'city-tokyo',
      name: 'Tokyo',
      country: 'Japan',
      imageUrl:
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
      rating: 4.95,
      description: 'Hyper-futuristic neon metropolis blended harmoniously with centuries-old Shinto shrines.',
      tag: 'Metropolis',
      avgCostPerDay: 210.0,
      latitude: 35.6762,
      longitude: 139.6503,
      isTrending: true,
    ),
    City(
      id: 'city-bali',
      name: 'Bali',
      country: 'Indonesia',
      imageUrl:
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
      rating: 4.85,
      description: 'Tropical paradise featuring lush rice terraces, sacred sea temples, coral reefs, and vibrant beach clubs.',
      tag: 'Tropical',
      avgCostPerDay: 95.0,
      latitude: -8.4095,
      longitude: 115.1889,
      isTrending: true,
    ),
    City(
      id: 'city-dubai',
      name: 'Dubai',
      country: 'UAE',
      imageUrl:
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      description: 'Gleaming desert oasis boasting record-breaking skyscrapers, luxury mega malls, and dune safaris.',
      tag: 'Luxury',
      avgCostPerDay: 260.0,
      latitude: 25.2048,
      longitude: 55.2708,
      isTrending: false,
    ),
    City(
      id: 'city-santorini',
      name: 'Santorini',
      country: 'Greece',
      imageUrl:
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      description: 'Whitewashed cliffside villages, caldera views, cobalt-blue domes, and world-renowned Aegean sunsets.',
      tag: 'Island',
      avgCostPerDay: 240.0,
      latitude: 36.3932,
      longitude: 25.4615,
      isTrending: true,
    ),
    City(
      id: 'city-newyork',
      name: 'New York',
      country: 'USA',
      imageUrl:
          'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80',
      rating: 4.85,
      description: 'The city that never sleeps, with Broadway lights, iconic Central Park, and global cuisine.',
      tag: 'Urban',
      avgCostPerDay: 280.0,
      latitude: 40.7128,
      longitude: -74.0060,
      isTrending: false,
    ),
  ];

  // Activities
  static const List<Activity> dummyActivities = [
    Activity(
      id: 'act-eiffel',
      cityId: 'city-paris',
      name: 'Eiffel Tower Sunset Summit & Champagne',
      category: 'Sightseeing',
      price: 85.0,
      duration: '3 hours',
      rating: 4.9,
      reviewsCount: 420,
      imageUrl:
          'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&auto=format&fit=crop&q=80',
      description: 'Skip-the-line access to the top floor of the Iron Lady with panoramic twilight city views.',
      location: 'Champ de Mars, 5 Av. Anatole France, Paris',
      isFeatured: true,
    ),
    Activity(
      id: 'act-louvre',
      cityId: 'city-paris',
      name: 'Louvre Masterpieces Guided Art Tour',
      category: 'Culture',
      price: 65.0,
      duration: '2.5 hours',
      rating: 4.8,
      reviewsCount: 310,
      imageUrl:
          'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=600&auto=format&fit=crop&q=80',
      description: 'Explore the Mona Lisa, Venus de Milo, and iconic wings with a certified art historian.',
      location: 'Rue de Rivoli, Paris',
      isFeatured: true,
    ),
    Activity(
      id: 'act-seine',
      cityId: 'city-paris',
      name: 'Bateaux Parisiens Gourmet Dinner Cruise',
      category: 'Dining',
      price: 110.0,
      duration: '2 hours',
      rating: 4.85,
      reviewsCount: 195,
      imageUrl:
          'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&auto=format&fit=crop&q=80',
      description: 'Glide along the Seine tasting 4-course French culinary creations under illuminated bridges.',
      location: 'Port de la Bourdonnais, Paris',
      isFeatured: false,
    ),
    Activity(
      id: 'act-colosseum',
      cityId: 'city-rome',
      name: 'Colosseum Underground & Gladiator Arena',
      category: 'History',
      price: 90.0,
      duration: '3.5 hours',
      rating: 4.95,
      reviewsCount: 680,
      imageUrl:
          'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80',
      description: 'Access the underground dungeons where gladiators prepped for combat and the arena floor.',
      location: 'Piazza del Colosseo, Rome',
      isFeatured: true,
    ),
    Activity(
      id: 'act-vatican',
      cityId: 'city-rome',
      name: 'Vatican Museums & Sistine Chapel Early Access',
      category: 'Art & History',
      price: 75.0,
      duration: '3 hours',
      rating: 4.9,
      reviewsCount: 520,
      imageUrl:
          'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&auto=format&fit=crop&q=80',
      description: 'Beat the crowds into Michelangelo\'s ceiling fresco and St. Peter\'s Basilica.',
      location: 'Viale Vaticano, Rome',
      isFeatured: true,
    ),
    Activity(
      id: 'act-shibuya',
      cityId: 'city-tokyo',
      name: 'Shibuya Crossing & Izakaya Food Alley Hop',
      category: 'Food & Nightlife',
      price: 70.0,
      duration: '3 hours',
      rating: 4.9,
      reviewsCount: 280,
      imageUrl:
          'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&auto=format&fit=crop&q=80',
      description: 'Navigate the legendary crossing and sample authentic yakitori, ramen, and craft sake.',
      location: 'Shibuya, Tokyo',
      isFeatured: true,
    ),
    Activity(
      id: 'act-ubud-swing',
      cityId: 'city-bali',
      name: 'Ubud Jungle Swing & Tegalalang Rice Terraces',
      category: 'Adventure',
      price: 45.0,
      duration: '4 hours',
      rating: 4.8,
      reviewsCount: 340,
      imageUrl:
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
      description: 'Soar above lush tropical canopies with panoramic valley views and artisan coffee tasting.',
      location: 'Tegalalang, Ubud, Bali',
      isFeatured: true,
    ),
  ];

  // Itinerary items for Grand Euro Tour Day 1-3
  static const List<ItineraryItem> dummyItinerary = [
    ItineraryItem(
      id: 'itin-01',
      dayNumber: 1,
      timeSlot: '09:30 AM',
      title: 'Arrival & Check-in at Le Marais Boutique Hotel',
      description: 'Drop luggage, freshen up and enjoy café au lait & croissants on the terrace.',
      location: 'Le Marais, Paris',
      cost: 0.0,
      category: 'Hotel',
      isCompleted: true,
    ),
    ItineraryItem(
      id: 'itin-02',
      dayNumber: 1,
      timeSlot: '01:00 PM',
      title: 'Louvre Masterpieces Guided Art Tour',
      description: 'Skip the line and explore the Italian Renaissance wing and Mona Lisa gallery.',
      location: 'Rue de Rivoli, Paris',
      cost: 65.0,
      category: 'Activity',
      isCompleted: true,
    ),
    ItineraryItem(
      id: 'itin-03',
      dayNumber: 1,
      timeSlot: '06:30 PM',
      title: 'Eiffel Tower Sunset Summit & Champagne',
      description: 'Sunset ascent to the summit followed by illuminated city nightscape photos.',
      location: 'Champ de Mars, Paris',
      cost: 85.0,
      category: 'Activity',
      isCompleted: false,
    ),
    ItineraryItem(
      id: 'itin-04',
      dayNumber: 2,
      timeSlot: '10:00 AM',
      title: 'Montmartre Artists Square & Sacré-Cœur Basilica',
      description: 'Walk through cobblestone streets, view portrait painters and panoramic hilltop view.',
      location: 'Montmartre, Paris',
      cost: 20.0,
      category: 'Sightseeing',
      isCompleted: false,
    ),
    ItineraryItem(
      id: 'itin-05',
      dayNumber: 2,
      timeSlot: '07:00 PM',
      title: 'Bateaux Parisiens Gourmet Dinner Cruise',
      description: '4-course French culinary dinner cruise drifting past Notre-Dame and Île de la Cité.',
      location: 'Port de la Bourdonnais, Paris',
      cost: 110.0,
      category: 'Dining',
      isCompleted: false,
    ),
    ItineraryItem(
      id: 'itin-06',
      dayNumber: 3,
      timeSlot: '08:30 AM',
      title: 'High-Speed TGV Train to Zurich HB',
      description: 'Scenic 4-hour rail journey through Eastern France and Swiss countryside.',
      location: 'Gare de Lyon -> Zurich HB',
      cost: 140.0,
      category: 'Transport',
      isCompleted: false,
    ),
  ];

  // Expenses for Trip 1
  static final List<Expense> dummyExpenses = [
    Expense(
      id: 'exp-01',
      tripId: 'trip-001',
      title: 'Roundtrip Flights & TGV Train Tickets',
      amount: 680.0,
      category: 'Flights',
      date: DateTime.now().subtract(const Duration(days: 10)),
      paymentMethod: 'Amex Platinum',
      notes: 'Air France + SBB Swiss Rail',
    ),
    Expense(
      id: 'exp-02',
      tripId: 'trip-001',
      title: 'Boutique Hotels & Alpine Chalets (8 Nights)',
      amount: 820.0,
      category: 'Stays',
      date: DateTime.now().subtract(const Duration(days: 6)),
      paymentMethod: 'Visa Signature',
      notes: 'Paris (3N), Zurich (2N), Rome (3N)',
    ),
    Expense(
      id: 'exp-03',
      tripId: 'trip-001',
      title: 'Michelin-guide Dining & Trattorias',
      amount: 350.0,
      category: 'Food',
      date: DateTime.now().subtract(const Duration(days: 2)),
      paymentMethod: 'Apple Pay',
      notes: 'Fine dining and local espresso bars',
    ),
    Expense(
      id: 'exp-04',
      tripId: 'trip-001',
      title: 'Museum Passes, Tours & Skip-the-Line',
      amount: 240.0,
      category: 'Activities',
      date: DateTime.now().subtract(const Duration(days: 1)),
      paymentMethod: 'Credit Card',
      notes: 'Louvre, Eiffel, Colosseum & Vatican',
    ),
  ];

  // Multi-City Stops for Trip 1
  static final List<TripStop> dummyStopsTrip1 = [
    TripStop(
      id: 'stop-01',
      city: dummyCities[0], // Paris
      arrivalDate: DateTime.now().add(const Duration(days: 14)),
      departureDate: DateTime.now().add(const Duration(days: 17)),
      budget: 850.0,
      hotelName: 'Le Marais Boutique Hotel',
      transportMode: 'Flight',
    ),
    TripStop(
      id: 'stop-02',
      city: dummyCities[1], // Zurich
      arrivalDate: DateTime.now().add(const Duration(days: 17)),
      departureDate: DateTime.now().add(const Duration(days: 19)),
      budget: 700.0,
      hotelName: 'Lake Zurich Grand Residence',
      transportMode: 'High Speed Train',
    ),
    TripStop(
      id: 'stop-03',
      city: dummyCities[2], // Rome
      arrivalDate: DateTime.now().add(const Duration(days: 19)),
      departureDate: DateTime.now().add(const Duration(days: 22)),
      budget: 800.0,
      hotelName: 'Piazza Navona Heritage Suites',
      transportMode: 'Flight',
    ),
  ];

  // Full Trip List
  static final List<Trip> dummyTrips = [
    Trip(
      id: 'trip-001',
      title: 'European Grand Tour 2026',
      description: 'Parisian cafes, Swiss alpine peaks, and Roman ancient monuments in one seamless multi-city adventure.',
      coverImageUrl:
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900&auto=format&fit=crop&q=80',
      startDate: DateTime.now().add(const Duration(days: 14)),
      endDate: DateTime.now().add(const Duration(days: 22)),
      budget: 3200.0,
      spent: 2090.0,
      currency: 'USD',
      status: TripStatus.upcoming,
      stops: dummyStopsTrip1,
      itineraryItems: dummyItinerary,
      expenses: dummyExpenses,
      isPublic: true,
      createdBy: 'Alex Morgan',
      travelersCount: 2,
    ),
    Trip(
      id: 'trip-002',
      title: 'Tropical Bali & Island Sanctuary',
      description: 'Immersive wellness retreat, waterfalls, sacred temples, and sunrise volcano trekking.',
      coverImageUrl:
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&auto=format&fit=crop&q=80',
      startDate: DateTime.now().add(const Duration(days: 45)),
      endDate: DateTime.now().add(const Duration(days: 52)),
      budget: 1800.0,
      spent: 650.0,
      currency: 'USD',
      status: TripStatus.upcoming,
      stops: [
        TripStop(
          id: 'stop-b1',
          city: dummyCities[4], // Bali
          arrivalDate: DateTime.now().add(const Duration(days: 45)),
          departureDate: DateTime.now().add(const Duration(days: 52)),
          budget: 1800.0,
          hotelName: 'Maya Ubud Resort & Spa',
          transportMode: 'Flight',
        ),
      ],
      itineraryItems: const [],
      expenses: const [],
      isPublic: true,
      createdBy: 'Alex Morgan',
      travelersCount: 1,
    ),
    Trip(
      id: 'trip-003',
      title: 'Tokyo Neon & Kyoto Heritage',
      description: 'Futuristic innovation meets ancient bamboo groves and traditional ryokans.',
      coverImageUrl:
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80',
      startDate: DateTime.now().subtract(const Duration(days: 90)),
      endDate: DateTime.now().subtract(const Duration(days: 80)),
      budget: 3500.0,
      spent: 3420.0,
      currency: 'USD',
      status: TripStatus.completed,
      stops: [
        TripStop(
          id: 'stop-t1',
          city: dummyCities[3], // Tokyo
          arrivalDate: DateTime.now().subtract(const Duration(days: 90)),
          departureDate: DateTime.now().subtract(const Duration(days: 80)),
          budget: 3500.0,
          hotelName: 'Shinjuku Prince Hotel',
          transportMode: 'Flight',
        ),
      ],
      itineraryItems: const [],
      expenses: const [],
      isPublic: true,
      createdBy: 'Alex Morgan',
      travelersCount: 2,
    ),
  ];
}
