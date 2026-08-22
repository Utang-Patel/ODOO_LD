import 'package:dio/dio.dart';
import '../core/constants/app_constants.dart';
import '../models/activity.dart';
import '../models/city.dart';
import '../models/trip.dart';
import '../models/user.dart';

/// API Service abstraction using Dio for future backend integration
class ApiService {
  final Dio _dio;

  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: AppConstants.defaultApiBaseUrl,
  );

  ApiService([Dio? customDio])
      : _dio = customDio ??
            Dio(
              BaseOptions(
                baseUrl: baseUrl,
                connectTimeout: const Duration(milliseconds: AppConstants.apiConnectTimeout),
                receiveTimeout: const Duration(milliseconds: AppConstants.apiReceiveTimeout),
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
              ),
            ) {
    _dio.interceptors.add(
      LogInterceptor(
        request: true,
        requestBody: true,
        responseBody: true,
        error: true,
      ),
    );
  }

  // --- Auth Endpoints (Phase 1 Frontend Placeholders) ---

  Future<User?> login(String email, String password) async {
    // In Phase 1, frontend dummy data is used.
    // Future backend endpoint: POST /auth/login
    return null;
  }

  Future<User?> register(String name, String email, String password) async {
    // Future backend endpoint: POST /auth/register
    return null;
  }

  // --- Trip Endpoints ---

  Future<List<Trip>> getTrips() async {
    // Future backend endpoint: GET /trips
    return [];
  }

  Future<Trip?> getTripById(String id) async {
    // Future backend endpoint: GET /trips/:id
    return null;
  }

  Future<Trip?> createTrip(Map<String, dynamic> tripData) async {
    // Future backend endpoint: POST /trips
    return null;
  }

  Future<bool> updateTrip(String id, Map<String, dynamic> updates) async {
    // Future backend endpoint: PUT /trips/:id
    return true;
  }

  // --- Destinations & Activities Endpoints ---

  Future<List<City>> getCities({String? query}) async {
    // Future backend endpoint: GET /cities
    return [];
  }

  Future<List<Activity>> getActivities(String cityId, {String? category}) async {
    // Future backend endpoint: GET /cities/:cityId/activities
    return [];
  }

  // --- Budget Endpoints ---

  Future<Map<String, dynamic>> getBudget(String tripId) async {
    // Future backend endpoint: GET /trips/:tripId/budget
    return {};
  }
}
