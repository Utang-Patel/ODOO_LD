/// App wide constants, limits, storage keys, and defaults
class AppConstants {
  AppConstants._();

  // Storage Keys
  static const String keyIsLoggedIn = 'gt_is_logged_in';
  static const String keyUserData = 'gt_user_data';
  static const String keySavedTripIds = 'gt_saved_trip_ids';
  static const String keyThemeMode = 'gt_theme_mode';

  // API Config — uses WiFi IP so physical Android devices can reach the backend
  // PC WiFi IP: 10.166.69.146  |  Backend port: 5000
  static const String defaultApiBaseUrl = 'http://10.166.69.146:5000/api';
  static const int apiConnectTimeout = 15000;
  static const int apiReceiveTimeout = 15000;

  // Responsive Breakpoints
  static const double breakpointMobileSmall = 360.0;
  static const double breakpointMobile = 480.0;
  static const double breakpointTablet = 768.0;
  static const double breakpointDesktop = 1024.0;

  // UI Dimensions & Radius
  static const double radiusSmall = 8.0;
  static const double radiusMedium = 16.0;
  static const double radiusLarge = 24.0;
  static const double radiusFull = 999.0;

  static const double paddingSmall = 8.0;
  static const double paddingMedium = 16.0;
  static const double paddingLarge = 24.0;
  static const double paddingExtraLarge = 32.0;

  // Animation Durations
  static const Duration animFast = Duration(milliseconds: 200);
  static const Duration animMedium = Duration(milliseconds: 350);
  static const Duration animSlow = Duration(milliseconds: 600);
}
