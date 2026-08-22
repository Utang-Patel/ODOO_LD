export const DASHBOARD_STATS = {
  tripsPlanned: 3,
  destinations: 8,
  travelDays: 24,
  estimatedBudget: "₹1,85,000"
};

export const DASHBOARD_TRIPS = [
  {
    id: "trip_1",
    name: "Europe Adventure",
    startDate: "12 Sep 2026",
    endDate: "20 Sep 2026",
    description: "An unforgettable multi-city tour through Paris, Zurich, and Rome featuring scenic trains, fine dining, and iconic historical landmarks.",
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    citiesCount: 3,
    daysCount: 8,
    estimatedBudget: 85500,
    status: "Upcoming"
  },
  {
    id: "trip_2",
    name: "Tropical Bali Getaway",
    startDate: "05 Nov 2026",
    endDate: "12 Nov 2026",
    description: "Relaxing beach resort, sacred water temples, Ubud monkey forest, and waterfall hiking.",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    citiesCount: 2,
    daysCount: 7,
    estimatedBudget: 62000,
    status: "Upcoming"
  },
  {
    id: "trip_3",
    name: "Tokyo & Kyoto Explorer",
    startDate: "10 Apr 2026",
    endDate: "20 Apr 2026",
    description: "Cherry blossom season experience visiting Shinjuku, Shibuya, Fushimi Inari, and Mt. Fuji.",
    coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    citiesCount: 2,
    daysCount: 10,
    estimatedBudget: 110000,
    status: "Completed"
  }
];

export const RECOMMENDED_DESTINATIONS = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    flag: "🇫🇷",
    costIndex: "$$$",
    popularity: 5,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "Iconic landmarks, romantic streets, haute cuisine, and world-class museum collections."
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    costIndex: "$$$",
    popularity: 5,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    description: "Futuristic neon skyscrapers juxtaposed with historic shinto shrines and culinary masterclass."
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    flag: "🇦🇪",
    costIndex: "$$$$",
    popularity: 4,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    description: "Ultra-modern luxury, desert dune safaris, soaring towers, and artificial archipelago wonders."
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    costIndex: "$$",
    popularity: 5,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    description: "Tropical paradise known for volcanic mountains, iconic rice terraces, and coral reefs."
  },
  {
    id: "zurich",
    name: "Zurich",
    country: "Switzerland",
    flag: "🇨🇭",
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
    costIndex: "$$$",
    popularity: 5,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    description: "Eternal City brimming with nearly 3,000 years of globally influential art and architecture."
  }
];

export const BUDGET_HIGHLIGHTS = {
  activeTripName: "Europe Adventure",
  totalEstimated: 85500,
  spentAmount: 62000,
  remainingAmount: 23500,
  progressPercentage: 72,
  categories: [
    { name: "Transport", amount: 25000, percentage: 30, color: "#0EA5E9", icon: "bi-airplane" },
    { name: "Accommodation", amount: 30000, percentage: 35, color: "#FF8A3D", icon: "bi-building" },
    { name: "Activities", amount: 12500, percentage: 15, color: "#06D6C9", icon: "bi-ticket-perforated" },
    { name: "Meals", amount: 18000, percentage: 20, color: "#22C55E", icon: "bi-cup-hot" }
  ]
};

export const QUICK_ACTIONS = [
  {
    id: "plan-trip",
    title: "Plan New Trip",
    description: "Start a new adventure",
    icon: "bi-airplane-fill",
    path: "/create-trip",
    gradient: "bg-ocean-gradient",
    textColor: "text-white"
  },
  {
    id: "explore-cities",
    title: "Explore Cities",
    description: "Discover destinations",
    icon: "bi-globe-americas",
    path: "/cities",
    gradient: "bg-white",
    textColor: "text-navy-deep"
  },
  {
    id: "view-calendar",
    title: "View Calendar",
    description: "See your travel schedule",
    icon: "bi-calendar-week-fill",
    path: "/calendar/trip_1",
    gradient: "bg-white",
    textColor: "text-navy-deep"
  },
  {
    id: "check-budget",
    title: "Check Budget",
    description: "Track your expenses",
    icon: "bi-wallet2",
    path: "/budget/trip_1",
    gradient: "bg-sunset-gradient",
    textColor: "text-navy-deep"
  }
];
