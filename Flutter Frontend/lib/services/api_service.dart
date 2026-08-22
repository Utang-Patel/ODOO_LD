import 'package:dio/dio.dart';
import '../core/constants/app_constants.dart';
import '../models/activity.dart';
import '../models/city.dart';
import '../models/trip.dart';

/// API Service — real HTTP calls to GlobeTrotter Express backend via Dio
class ApiService {
  final Dio _dio;
  String? _token;

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
    // Auth token interceptor — auto-attach JWT to every request
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (_token != null) {
            options.headers['Authorization'] = 'Bearer $_token';
          }
          handler.next(options);
        },
        onError: (DioException e, handler) {
          handler.next(e);
        },
      ),
    );

    _dio.interceptors.add(
      LogInterceptor(request: true, requestBody: true, responseBody: true, error: true),
    );
  }

  /// Set the JWT token for authenticated requests
  void setToken(String? token) {
    _token = token;
  }

  // ─── Auth Endpoints ──────────────────────────────────────────────────────

  /// POST /api/auth/login → returns {token, user}
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post('/auth/login', data: {
      'email': email.trim(),
      'password': password,
    });
    return response.data as Map<String, dynamic>;
  }

  /// POST /api/auth/signup → returns {token, user}
  Future<Map<String, dynamic>> signup(String name, String email, String password) async {
    final response = await _dio.post('/auth/signup', data: {
      'name': name.trim(),
      'email': email.trim(),
      'password': password,
    });
    return response.data as Map<String, dynamic>;
  }

  // ─── Trip Endpoints ───────────────────────────────────────────────────────

  /// GET /api/trips → returns list of trips for authenticated user
  Future<List<Trip>> getTrips() async {
    try {
      final response = await _dio.get('/trips');
      final data = response.data;
      final List list = data is List ? data : (data['trips'] ?? data['data'] ?? []);
      return list.map((t) => Trip.fromJson(t as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  /// POST /api/trips → creates a new trip
  Future<Trip?> createTrip(Map<String, dynamic> tripData) async {
    try {
      final response = await _dio.post('/trips', data: tripData);
      final data = response.data;
      final tripJson = data['trip'] ?? data['data'] ?? data;
      return Trip.fromJson(tripJson as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  // ─── City & Activity Endpoints ────────────────────────────────────────────

  /// GET /api/cities → returns all cities
  Future<List<City>> getCities({String? query}) async {
    try {
      final response = await _dio.get('/cities', queryParameters: query != null ? {'q': query} : null);
      final data = response.data;
      final List list = data is List ? data : (data['cities'] ?? data['data'] ?? []);
      return list.map((c) => City.fromJson(c as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  /// GET /api/activities?cityId=:cityId → returns activities for a city
  Future<List<Activity>> getActivities(String cityId, {String? category}) async {
    try {
      final response = await _dio.get('/activities', queryParameters: {
        'cityId': cityId,
        if (category != null && category != 'All') 'category': category,
      });
      final data = response.data;
      final List list = data is List ? data : (data['activities'] ?? data['data'] ?? []);
      return list.map((a) => Activity.fromJson(a as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }
}
