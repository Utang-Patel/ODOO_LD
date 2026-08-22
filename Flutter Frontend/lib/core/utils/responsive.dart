import 'package:flutter/material.dart';
import '../constants/app_constants.dart';

/// Responsive utility helper for adaptive layouts across phones and tablets
class Responsive extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  const Responsive({
    super.key,
    required this.mobile,
    this.tablet,
    this.desktop,
  });

  static bool isMobileSmall(BuildContext context) =>
      MediaQuery.of(context).size.width < AppConstants.breakpointMobileSmall;

  static bool isMobile(BuildContext context) =>
      MediaQuery.of(context).size.width < AppConstants.breakpointTablet;

  static bool isTablet(BuildContext context) =>
      MediaQuery.of(context).size.width >= AppConstants.breakpointTablet &&
      MediaQuery.of(context).size.width < AppConstants.breakpointDesktop;

  static bool isDesktop(BuildContext context) =>
      MediaQuery.of(context).size.width >= AppConstants.breakpointDesktop;

  static double screenWidth(BuildContext context) =>
      MediaQuery.of(context).size.width;

  static double screenHeight(BuildContext context) =>
      MediaQuery.of(context).size.height;

  static int gridCrossAxisCount(BuildContext context, {int mobileCount = 1, int tabletCount = 2, int desktopCount = 3}) {
    if (isDesktop(context)) return desktopCount;
    if (isTablet(context)) return tabletCount;
    return mobileCount;
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= AppConstants.breakpointDesktop && desktop != null) {
          return desktop!;
        }
        if (constraints.maxWidth >= AppConstants.breakpointTablet && tablet != null) {
          return tablet!;
        }
        return mobile;
      },
    );
  }
}
