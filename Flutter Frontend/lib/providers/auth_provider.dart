import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/dummy_data.dart';
import '../models/user.dart';
import '../services/storage_service.dart';

/// Storage service provider placeholder
final storageServiceProvider = Provider<StorageService>((ref) {
  throw UnimplementedError('StorageService must be overridden in ProviderScope');
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

  AuthNotifier(this._storageService) : super(const AuthState()) {
    _initSession();
  }

  void _initSession() {
    final isLoggedIn = _storageService.isLoggedIn;
    final savedUser = _storageService.getUser();
    if (isLoggedIn) {
      state = AuthState(
        user: savedUser ?? DummyData.dummyUser,
        isAuthenticated: true,
        isLoading: false,
      );
    } else {
      state = const AuthState(isAuthenticated: false);
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    await Future.delayed(const Duration(milliseconds: 700)); // Simulated smooth network delay

    if (email.trim().isEmpty || password.isEmpty) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Please enter valid login credentials.',
      );
      return false;
    }

    final loggedInUser = DummyData.dummyUser.copyWith(email: email.trim());
    await _storageService.saveUser(loggedInUser);
    await _storageService.setLoggedIn(true);

    state = AuthState(
      user: loggedInUser,
      isAuthenticated: true,
      isLoading: false,
    );
    return true;
  }

  Future<bool> signup({
    required String name,
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    await Future.delayed(const Duration(milliseconds: 700));

    if (name.trim().isEmpty || email.trim().isEmpty || password.length < 6) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Please check your information and try again.',
      );
      return false;
    }

    final newUser = DummyData.dummyUser.copyWith(
      id: 'usr-${DateTime.now().millisecondsSinceEpoch}',
      name: name.trim(),
      email: email.trim(),
    );

    await _storageService.saveUser(newUser);
    await _storageService.setLoggedIn(true);

    state = AuthState(
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    );
    return true;
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);
    await _storageService.clearSession();
    state = const AuthState(isAuthenticated: false, user: null, isLoading: false);
  }

  Future<bool> resetPassword(String email) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    await Future.delayed(const Duration(milliseconds: 600));
    state = state.copyWith(isLoading: false);
    return true;
  }
}

/// Global Auth Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final storage = ref.watch(storageServiceProvider);
  return AuthNotifier(storage);
});
