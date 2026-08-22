export const DUMMY_USER = {
  id: "usr_101",
  name: "Alex Morgan",
  email: "alex.morgan@globetrotter.io",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  bio: "Passionate globetrotter, photographer, and culture enthusiast.",
  savedDestinations: ["Paris", "Zurich", "Tokyo", "Bali"],
  currency: "INR (₹)",
  language: "English"
};

export const DUMMY_TRIPS = [
  {
    id: "trip_1",
    name: "Europe Adventure",
    startDate: "2026-09-12",
    endDate: "2026-09-20",
    description: "An unforgettable multi-city tour through Paris, Zurich, and Rome featuring scenic trains, fine dining, and iconic historical landmarks.",
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    citiesCount: 3,
    daysCount: 8,
    estimatedBudget: 85500,
    status: "Upcoming",
    stops: [
      {
        id: "stop_1",
        cityName: "Paris",
        country: "France",
        flag: "🇫🇷",
        startDate: "2026-09-12",
        endDate: "2026-09-14",
        activities: [
          { id: "act_1", time: "09:00", name: "Airport Arrival & Hotel Check-in", category: "Transport", cost: 0, icon: "bi-airplane" },
          { id: "act_2", time: "11:00", name: "Eiffel Tower Sightseeing", category: "Sightseeing", cost: 2200, icon: "bi-building" },
          { id: "act_3", time: "14:00", name: "Lunch at Le Petit Bistro", category: "Food", cost: 1350, icon: "bi-cup-hot" },
          { id: "act_4", time: "18:00", name: "Seine River Cruise at Sunset", category: "Sightseeing", cost: 2700, icon: "bi-water" }
        ]
      },
      {
        id: "stop_2",
        cityName: "Zurich",
        country: "Switzerland",
        flag: "🇨🇭",
        startDate: "2026-09-15",
        endDate: "2026-09-17",
        activities: [
          { id: "act_5", time: "10:00", name: "Lake Zurich Boat Tour", category: "Sightseeing", cost: 3500, icon: "bi-water" },
          { id: "act_6", time: "14:00", name: "Old Town Walk & Swiss Chocolate Tasting", category: "Food", cost: 2100, icon: "bi-bag-check" }
        ]
      },
      {
        id: "stop_3",
        cityName: "Rome",
        country: "Italy",
        flag: "🇮🇹",
        startDate: "2026-09-18",
        endDate: "2026-09-20",
        activities: [
          { id: "act_7", time: "09:30", name: "Colosseum Guided Tour", category: "Culture", cost: 2800, icon: "bi-bank" },
          { id: "act_8", time: "15:00", name: "Vatican Museums & Sistine Chapel", category: "Culture", cost: 3100, icon: "bi-palette" }
        ]
      }
    ],
    budgetBreakdown: {
      transport: 25000,
      accommodation: 30000,
      activities: 12500,
      meals: 18000,
      total: 85500
    }
  },
  {
    id: "trip_2",
    name: "Tropical Bali Getaway",
    startDate: "2026-11-05",
    endDate: "2026-11-12",
    description: "Relaxing beach resort, sacred water temples, Ubud monkey forest, and waterfall hiking.",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    citiesCount: 2,
    daysCount: 7,
    estimatedBudget: 62000,
    status: "Upcoming",
    stops: [
      {
        id: "stop_4",
        cityName: "Ubud",
        country: "Indonesia",
        flag: "🇮🇩",
        startDate: "2026-11-05",
        endDate: "2026-11-08",
        activities: [
          { id: "act_9", time: "08:00", name: "Sacred Monkey Forest Sanctuary", category: "Nature", cost: 800, icon: "bi-tree" },
          { id: "act_10", time: "11:00", name: "Tegallalang Rice Terraces", category: "Sightseeing", cost: 500, icon: "bi-sun" }
        ]
      }
    ],
    budgetBreakdown: {
      transport: 18000,
      accommodation: 24000,
      activities: 10000,
      meals: 10000,
      total: 62000
    }
  },
  {
    id: "trip_3",
    name: "Tokyo & Kyoto Explorer",
    startDate: "2026-04-10",
    endDate: "2026-04-20",
    description: "Cherry blossom season experience visiting Shinjuku, Shibuya, Fushimi Inari, and Mt. Fuji.",
    coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    citiesCount: 2,
    daysCount: 10,
    estimatedBudget: 110000,
    status: "Completed",
    stops: [],
    budgetBreakdown: {
      transport: 35000,
      accommodation: 45000,
      activities: 15000,
      meals: 15000,
      total: 110000
    }
  }
];

export const DUMMY_CITIES = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    flag: "🇫🇷",
    region: "Europe",
    costIndex: "$$$",
    popularity: 5,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "City of lights, world-class gastronomy, haute couture, and art landmarks."
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    region: "Asia",
    costIndex: "$$$",
    popularity: 5,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    description: "Futuristic skyscrapers juxtaposed with tranquil historic temples and incredible street food."
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    region: "Middle East",
    costIndex: "$$$$",
    popularity: 4,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    description: "Ultra-modern luxury, desert safaris, soaring towers, and artificial islands."
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    region: "Asia",
    costIndex: "$$",
    popularity: 5,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    description: "Tropical paradise known for volcanic mountains, iconic rice paddies, beaches, and coral reefs."
  },
  {
    id: "zurich",
    name: "Zurich",
    country: "Switzerland",
    flag: "🇨🇭",
    region: "Europe",
    costIndex: "$$$$",
    popularity: 4,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    description: "Picturesque lakeside metropolis framed by the snow-capped Swiss Alps."
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    flag: "🇮🇹",
    region: "Europe",
    costIndex: "$$$",
    popularity: 5,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    description: "Eternal City brimming with nearly 3,000 years of globally influential art and architecture."
  }
];

export const DUMMY_ACTIVITIES = [
  {
    id: "act_101",
    cityId: "paris",
    name: "Eiffel Tower Sightseeing",
    category: "Sightseeing",
    duration: "2 hours",
    cost: 2200,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=600&q=80",
    description: "Ascend the world's most famous tower for breathtaking panoramic views across Paris."
  },
  {
    id: "act_102",
    cityId: "paris",
    name: "Louvre Museum Guided Tour",
    category: "Culture",
    duration: "3.5 hours",
    cost: 1800,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80",
    description: "Explore masterpieces including the Mona Lisa and Venus de Milo in the world's largest art museum."
  },
  {
    id: "act_103",
    cityId: "paris",
    name: "Montmartre Food & Wine Tasting",
    category: "Food",
    duration: "3 hours",
    cost: 3500,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
    description: "Sample artisanal French cheeses, freshly baked croissants, and organic wines in historic Montmartre."
  },
  {
    id: "act_104",
    cityId: "zurich",
    name: "Lindt Home of Chocolate Experience",
    category: "Food",
    duration: "2 hours",
    cost: 1500,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80",
    description: "Interactive chocolate museum featuring a giant chocolate fountain and Unlimited tasting room."
  }
];

export const DUMMY_STATS = {
  totalTrips: 12,
  countriesVisited: 8,
  citiesExplored: 15,
  totalSavedBudget: "₹2,57,500"
};
