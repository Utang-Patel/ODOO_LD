import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants/app_constants.dart';
import '../models/user.dart';

/// Storage service for local persistence (auth session, user profile, preferences)
class StorageService {
  final SharedPreferences _prefs;

  StorageService(this._prefs);

  static Future<StorageService> init() async {
    final prefs = await SharedPreferences.getInstance();
    return StorageService(prefs);
  }

  // Auth State
  bool get isLoggedIn => _prefs.getBool(AppConstants.keyIsLoggedIn) ?? false;

  Future<bool> setLoggedIn(bool value) async {
    return await _prefs.setBool(AppConstants.keyIsLoggedIn, value);
  }

  // User Profile
  User? getUser() {
    final jsonStr = _prefs.getString(AppConstants.keyUserData);
    if (jsonStr == null) return null;
    try {
      final map = jsonDecode(jsonStr) as Map<String, dynamic>;
      return User.fromJson(map);
    } catch (_) {
      return null;
    }
  }

  Future<bool> saveUser(User user) async {
    final jsonStr = jsonEncode(user.toJson());
    return await _prefs.setString(AppConstants.keyUserData, jsonStr);
  }

  Future<bool> clearSession() async {
    await _prefs.remove(AppConstants.keyIsLoggedIn);
    await _prefs.remove(AppConstants.keyUserData);
    return true;
  }

  // Saved / Bookmarked Trip IDs
  List<String> getSavedTripIds() {
    return _prefs.getStringList(AppConstants.keySavedTripIds) ?? [];
  }

  Future<bool> toggleSavedTrip(String tripId) async {
    final list = getSavedTripIds();
    if (list.contains(tripId)) {
      list.remove(tripId);
    } else {
      list.add(tripId);
    }
    return await _prefs.setStringList(AppConstants.keySavedTripIds, list);
  }
}
