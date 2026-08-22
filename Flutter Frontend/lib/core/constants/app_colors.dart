import 'package:flutter/material.dart';

/// Deep Space & Cyber Neon Design System Theme Colors for GlobeTrotter (aligned with React frontend)
class AppColors {
  AppColors._();

  // Design Token Primary Colors
  static const Color bgPrimary = Color(0xFF070B1A); // Deepest Dark Navy Space
  static const Color bgSecondary = Color(0xFF0B1026); // Card Background
  static const Color surface = Color(0xFF111936); // Glass Surface
  static const Color surfaceHover = Color(0xFF151D3D); // Hover Surface

  static const Color primary = Color(0xFF7C3AED); // Violet / Purple
  static const Color secondary = Color(0xFFEC4899); // Hot Pink
  static const Color accent = Color(0xFFF97316); // Sunset Orange
  static const Color supporting = Color(0xFF06B6D4); // Cyan
  static const Color cyan = Color(0xFF06B6D4);
  static const Color emerald = Color(0xFF10B981);
  static const Color green = Color(0xFF10B981);

  // Backward-Compatible Color Aliases
  static const Color deepNavy = Color(0xFF070B1A);
  static const Color oceanBlue = Color(0xFF7C3AED);
  static const Color aqua = Color(0xFF06B6D4);
  static const Color tropicalGreen = Color(0xFF10B981);
  static const Color sunsetOrange = Color(0xFFF97316);
  static const Color goldenYellow = Color(0xFFFBBF24);

  // Background & Surface Colors
  static const Color cloud = Color(0xFF070B1A);
  static const Color white = Color(0xFFFFFFFF);
  static const Color surfaceLight = Color(0xFF111936);
  static const Color cardBg = Color(0xFF0B1026);
  static const Color background = Color(0xFF070B1A);
  static const Color darkBackground = Color(0xFF070B1A);
  static const Color surfaceDark = Color(0xFF111936);

  // Text Colors
  static const Color textMain = Color(0xFFF8FAFC); // Crisp Bright White
  static const Color textSecondary = Color(0xFFCBD5E1); // Light Slate
  static const Color textMuted = Color(0xFF94A3B8); // Muted Slate
  static const Color textWhite = Color(0xFFFFFFFF);

  // Border & Divider Colors
  static const Color border = Color(0x387C3AED); // rgba(124, 58, 237, 0.22)
  static const Color borderGlass = Color(0x1FFFFFFF); // rgba(255, 255, 255, 0.12)
  static const Color borderBright = Color(0x59EC4899); // rgba(236, 72, 153, 0.35)
  static const Color borderLight = Color(0x26CBD5E1);
  static const Color divider = Color(0x1FFFFFFF);

  // Feedback & Status Colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF97316);
  static const Color danger = Color(0xFFF43F5E);
  static const Color info = Color(0xFF06B6D4);

  // Gradients
  static const LinearGradient saasGradient = LinearGradient(
    colors: [primary, secondary, accent],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, secondary, accent],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient indigoGradient = LinearGradient(
    colors: [Color(0xFF312E81), primary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient cyanGradient = LinearGradient(
    colors: [cyan, primary, secondary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient sunsetGradient = LinearGradient(
    colors: [secondary, accent],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroGradient = LinearGradient(
    colors: [bgPrimary, bgSecondary, surface],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient auroraGradient = LinearGradient(
    colors: [
      Color(0xFF070B1A),
      Color(0xFF1E1B4B),
      Color(0xFF312E81),
      Color(0xFF7C3AED),
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient cardOverlayGradient = LinearGradient(
    colors: [Colors.transparent, Color(0xEE070B1A)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient glassGradient = LinearGradient(
    colors: [
      Color(0xBF111936),
      Color(0xBF0B1026),
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
