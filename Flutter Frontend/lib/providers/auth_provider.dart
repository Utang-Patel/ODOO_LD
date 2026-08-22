import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

/// Storage service provider placeholder
final storageServiceProvider = Provider<StorageService>((ref) {
  throw UnimplementedError('StorageService must be overridden in ProviderScope');
});

/// API service provider
final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});

/// Auth state model
class AuthState {
  final User? user;
  final bool isAuthenticated;
  final bool isLoading;
  final String? errorMessage;

  const AuthState({
    this.user,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.errorMessage,
  });

  AuthState copyWith({
    User? user,
    bool? isAuthenticated,
    bool? isLoading,
    String? errorMessage,
  }) {
    return AuthState(
      user: user ?? this.user,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
    );
  }
}

/// State notifier for user authentication
class AuthNotifier extends StateNotifier<AuthState> {
  final StorageService _storageService;
  final ApiService _apiService;

  AuthNotifier(this._storageService, this._apiService) : super(const AuthState()) {
    _initSession();
  }

  void _initSession() {
    final isLoggedIn = _storageService.isLoggedIn;
    final savedUser = _storageService.getUser();
    final token = _storageService.getToken();

    if (isLoggedIn && savedUser != null && token != null) {
      _apiService.setToken(token);
      state = AuthState(
        user: savedUser,
        isAuthenticated: true,
        isLoading: false,
      );
    } else {
      state = const AuthState(isAuthenticated: false);
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final result = await _apiService.login(email, password);

      if (result['success'] == true) {
        final token = result['token'] as String;
        final userJson = result['user'] as Map<String, dynamic>;

        final user = User(
          id: userJson['id'].toString(),
          name: userJson['name'] as String,
          email: userJson['email'] as String,
          avatarUrl: userJson['profile_image'] as String? ?? '',
        );

        _apiService.setToken(token);
        await _storageService.saveToken(token);
        await _storageService.saveUser(user);
        await _storageService.setLoggedIn(true);

        state = AuthState(user: user, isAuthenticated: true, isLoading: false);
        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: result['message'] as String? ?? 'Login failed.',
        );
        return false;
      }
    } on DioException catch (e) {
      final message = (e.response?.data as Map<String, dynamic>?)?['message'] as String?
          ?? 'Network error. Check your connection.';
      state = state.copyWith(isLoading: false, errorMessage: message);
      return false;
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: 'Unexpected error. Please try again.');
      return false;
    }
  }

  Future<bool> signup({
    required String name,
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final result = await _apiService.signup(name, email, password);

      if (result['success'] == true) {
        final token = result['token'] as String;
        final userJson = result['user'] as Map<String, dynamic>;

        final user = User(
          id: userJson['id'].toString(),
          name: userJson['name'] as String,
          email: userJson['email'] as String,
          avatarUrl: userJson['profile_image'] as String? ?? '',
        );

        _apiService.setToken(token);
        await _storageService.saveToken(token);
        await _storageService.saveUser(user);
        await _storageService.setLoggedIn(true);

        state = AuthState(user: user, isAuthenticated: true, isLoading: false);
        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: result['message'] as String? ?? 'Signup failed.',
        );
        return false;
      }
    } on DioException catch (e) {
      final message = (e.response?.data as Map<String, dynamic>?)?['message'] as String?
          ?? 'Network error. Check your connection.';
      state = state.copyWith(isLoading: false, errorMessage: message);
      return false;
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: 'Unexpected error. Please try again.');
      return false;
    }
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);
    _apiService.setToken(null);
    await _storageService.clearSession();
    state = const AuthState(isAuthenticated: false, user: null, isLoading: false);
  }

  Future<bool> resetPassword(String email) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    // Backend doesn't expose a reset endpoint yet — simulate success
    await Future.delayed(const Duration(milliseconds: 600));
    state = state.copyWith(isLoading: false);
    return true;
  }
}

/// Global Auth Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final storage = ref.watch(storageServiceProvider);
  final api = ref.watch(apiServiceProvider);
  return AuthNotifier(storage, api);
});
