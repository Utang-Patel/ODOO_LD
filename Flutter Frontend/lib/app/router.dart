import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../screens/admin/admin_dashboard_screen.dart';
import '../screens/auth/forgot_password_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/signup_screen.dart';
import '../screens/budget/budget_screen.dart';
import '../screens/calendar/calendar_screen.dart';
import '../screens/dashboard/dashboard_screen.dart';
import '../screens/explore/activity_search_screen.dart';
import '../screens/explore/city_search_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/shared/shared_trip_screen.dart';
import '../screens/trips/create_trip_screen.dart';
import '../screens/trips/itinerary_builder_screen.dart';
import '../screens/trips/itinerary_view_screen.dart';
import '../screens/trips/my_trips_screen.dart';

/// Global App Router Provider using GoRouter
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: authState.isAuthenticated ? '/dashboard' : '/login',
    redirect: (BuildContext context, GoRouterState state) {
      final isAuth = authState.isAuthenticated;
      final location = state.uri.toString();

      final isAuthRoute = location == '/login' ||
          location == '/signup' ||
          location == '/forgot-password';

      // If user is not authenticated and trying to access protected screens
      if (!isAuth && !isAuthRoute) {
        return '/login';
      }

      // If user is authenticated and on login or signup screen
      if (isAuth && isAuthRoute) {
        return '/dashboard';
      }

      return null;
    },
    routes: [
      // Auth Routes
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        name: 'signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: '/forgot-password',
        name: 'forgot-password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),

      // Dashboard / Home Route
      GoRoute(
        path: '/dashboard',
        name: 'dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),

      // Trip Routes
      GoRoute(
        path: '/create-trip',
        name: 'create-trip',
        builder: (context, state) => const CreateTripScreen(),
      ),
      GoRoute(
        path: '/my-trips',
        name: 'my-trips',
        builder: (context, state) => const MyTripsScreen(),
      ),
      GoRoute(
        path: '/itinerary/:tripId',
        name: 'itinerary-builder',
        builder: (context, state) {
          final tripId = state.pathParameters['tripId'] ?? 'trip-001';
          return ItineraryBuilderScreen(tripId: tripId);
        },
      ),
      GoRoute(
        path: '/itinerary/:tripId/view',
        name: 'itinerary-view',
        builder: (context, state) {
          final tripId = state.pathParameters['tripId'] ?? 'trip-001';
          return ItineraryViewScreen(tripId: tripId);
        },
      ),

      // Explore Routes
      GoRoute(
        path: '/cities',
        name: 'cities',
        builder: (context, state) => const CitySearchScreen(),
      ),
      GoRoute(
        path: '/activities/:cityId',
        name: 'activities',
        builder: (context, state) {
          final cityId = state.pathParameters['cityId'] ?? 'city-paris';
          return ActivitySearchScreen(cityId: cityId);
        },
      ),

      // Budget & Calendar Routes
      GoRoute(
        path: '/budget/:tripId',
        name: 'budget',
        builder: (context, state) {
          final tripId = state.pathParameters['tripId'] ?? 'trip-001';
          return BudgetScreen(tripId: tripId);
        },
      ),
      GoRoute(
        path: '/calendar/:tripId',
        name: 'calendar',
        builder: (context, state) {
          final tripId = state.pathParameters['tripId'] ?? 'trip-001';
          return CalendarScreen(tripId: tripId);
        },
      ),

      // Public / Community Shared Trip Route
      GoRoute(
        path: '/shared/:tripId',
        name: 'shared',
        builder: (context, state) {
          final tripId = state.pathParameters['tripId'] ?? 'trip-001';
          return SharedTripScreen(tripId: tripId);
        },
      ),

      // User Profile Route
      GoRoute(
        path: '/profile',
        name: 'profile',
        builder: (context, state) => const ProfileScreen(),
      ),

      // Admin & Analytics Route
      GoRoute(
        path: '/admin',
        name: 'admin',
        builder: (context, state) => const AdminDashboardScreen(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Page Not Found (404)', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => context.go('/dashboard'),
              child: const Text('Return to Home'),
            ),
          ],
        ),
      ),
    ),
  );
});
