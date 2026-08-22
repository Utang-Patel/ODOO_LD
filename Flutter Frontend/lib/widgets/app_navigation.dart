import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_strings.dart';

/// Adaptive responsive navigation wrapper supporting both Mobile Bottom Bar and Tablet Navigation Rail
class AppNavigation extends StatelessWidget {
  final int currentIndex;
  final Widget child;

  const AppNavigation({
    super.key,
    required this.currentIndex,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth >= 768;

        if (!isWide) {
          return child;
        }

        // Tablet / Desktop Navigation Rail Layout
        return Scaffold(
          body: Row(
            children: [
              NavigationRail(
                selectedIndex: currentIndex,
                onDestinationSelected: (index) => _onItemTapped(context, index),
                labelType: NavigationRailLabelType.all,
                backgroundColor: AppColors.white,
                selectedIconTheme: const IconThemeData(color: AppColors.oceanBlue),
                unselectedIconTheme: const IconThemeData(color: AppColors.textMuted),
                selectedLabelTextStyle: const TextStyle(
                  color: AppColors.oceanBlue,
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                ),
                unselectedLabelTextStyle: const TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 12,
                ),
                leading: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.flight_takeoff_rounded, color: AppColors.white, size: 24),
                  ),
                ),
                destinations: const [
                  NavigationRailDestination(
                    icon: Icon(Icons.home_outlined),
                    selectedIcon: Icon(Icons.home_rounded),
                    label: Text(AppStrings.navHome),
                  ),
                  NavigationRailDestination(
                    icon: Icon(Icons.luggage_outlined),
                    selectedIcon: Icon(Icons.luggage_rounded),
                    label: Text(AppStrings.navTrips),
                  ),
                  NavigationRailDestination(
                    icon: Icon(Icons.travel_explore_outlined),
                    selectedIcon: Icon(Icons.travel_explore_rounded),
                    label: Text(AppStrings.navExplore),
                  ),
                  NavigationRailDestination(
                    icon: Icon(Icons.calendar_month_outlined),
                    selectedIcon: Icon(Icons.calendar_month_rounded),
                    label: Text(AppStrings.navCalendar),
                  ),
                  NavigationRailDestination(
                    icon: Icon(Icons.person_outline_rounded),
                    selectedIcon: Icon(Icons.person_rounded),
                    label: Text(AppStrings.navProfile),
                  ),
                ],
              ),
              const VerticalDivider(thickness: 1, width: 1),
              Expanded(child: child),
            ],
          ),
        );
      },
    );
  }

  void _onItemTapped(BuildContext context, int index) {
    if (index == currentIndex) return;

    switch (index) {
      case 0:
        context.go('/dashboard');
        break;
      case 1:
        context.go('/my-trips');
        break;
      case 2:
        context.go('/cities');
        break;
      case 3:
        context.go('/calendar/trip-001');
        break;
      case 4:
        context.go('/profile');
        break;
    }
  }
}
