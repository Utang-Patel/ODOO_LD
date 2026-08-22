import 'package:flutter/material.dart';

/// Tropical Aurora Design Theme Colors for GlobeTrotter
class AppColors {
  AppColors._();

  // Primary Brand Colors
  static const Color deepNavy = Color(0xFF071A2B);
  static const Color oceanBlue = Color(0xFF0EA5E9);
  static const Color aqua = Color(0xFF06D6C9);
  static const Color tropicalGreen = Color(0xFF22C55E);
  static const Color sunsetOrange = Color(0xFFFF8A3D);
  static const Color goldenYellow = Color(0xFFFFD166);

  // Background & Surface Colors
  static const Color cloud = Color(0xFFF5FBFF);
  static const Color white = Color(0xFFFFFFFF);
  static const Color surfaceLight = Color(0xFFFFFFFF);
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color background = Color(0xFFF5FBFF);
  static const Color darkBackground = Color(0xFF051321);
  static const Color surfaceDark = Color(0xFF0C2338);

  // Text Colors
  static const Color textMain = Color(0xFF071A2B);
  static const Color textSecondary = Color(0xFF475569);
  static const Color textMuted = Color(0xFF64748B);
  static const Color textWhite = Color(0xFFFFFFFF);

  // Border & Divider Colors
  static const Color border = Color(0xFFDCEAF2);
  static const Color borderLight = Color(0xFFE8F2F8);
  static const Color divider = Color(0xFFE2EBF0);

  // Feedback & Status Colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFFF8A3D);
  static const Color danger = Color(0xFFEF4444);
  static const Color info = Color(0xFF0EA5E9);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [oceanBlue, aqua],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient sunsetGradient = LinearGradient(
    colors: [sunsetOrange, goldenYellow],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroGradient = LinearGradient(
    colors: [deepNavy, Color(0xFF0C2E4E), Color(0xFF071A2B)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient auroraGradient = LinearGradient(
    colors: [
      Color(0xFF071A2B),
      Color(0xFF0E385D),
      Color(0xFF064E67),
      Color(0xFF06D6C9),
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient cardOverlayGradient = LinearGradient(
    colors: [Colors.transparent, Color(0xCC071A2B)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient glassGradient = LinearGradient(
    colors: [
      Color(0x33FFFFFF),
      Color(0x0DFFFFFF),
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
