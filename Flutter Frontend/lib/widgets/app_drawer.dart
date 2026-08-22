import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../core/constants/app_colors.dart';
import '../providers/auth_provider.dart';

/// Dark Theme Side Navigation Drawer matching the custom design
class AppDrawer extends ConsumerWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    String currentRoute = '';
    try {
      currentRoute = GoRouterState.of(context).uri.toString();
    } catch (_) {}

    return Drawer(
      backgroundColor: const Color(0xFF071724), // Dark Navy Background
      child: SafeArea(
        child: Column(
          children: [
            // Top Header: Logo & App Title
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
              child: Row(
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: AppColors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.25),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.asset(
                        'assets/images/logo.png',
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  RichText(
                    text: const TextSpan(
                      children: [
                        TextSpan(
                          text: 'Globe',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.5,
                          ),
                        ),
                        TextSpan(
                          text: 'Trotter',
                          style: TextStyle(
                            color: Color(0xFF00E5D9),
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const Divider(color: Color(0xFF1E3A52), height: 1, indent: 20, endIndent: 20),
            const SizedBox(height: 12),

            // Main Menu List
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.home_outlined,
                    title: 'Dashboard',
                    route: '/dashboard',
                    currentRoute: currentRoute,
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.flight_outlined,
                    title: 'My Trips',
                    route: '/my-trips',
                    currentRoute: currentRoute,
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.add_circle_outline_rounded,
                    title: 'Plan New Trip',
                    route: '/create-trip',
                    currentRoute: currentRoute,
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.language_outlined,
                    title: 'Explore Cities',
                    route: '/cities',
                    currentRoute: currentRoute,
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.confirmation_number_outlined,
                    title: 'Activities',
                    route: '/activities/city-paris',
                    currentRoute: currentRoute,
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.calendar_today_outlined,
                    title: 'Calendar',
                    route: '/calendar/trip-001',
                    currentRoute: currentRoute,
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.account_balance_wallet_outlined,
                    title: 'Budget',
                    route: '/budget/trip-001',
                    currentRoute: currentRoute,
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.share_outlined,
                    title: 'Shared Trip',
                    route: '/shared/trip-001',
                    currentRoute: currentRoute,
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.person_outline_rounded,
                    title: 'Profile',
                    route: '/profile',
                    currentRoute: currentRoute,
                  ),
                ],
              ),
            ),



            // Log Out Button
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
              child: InkWell(
                onTap: () async {
                  Navigator.pop(context);
                  await ref.read(authProvider.notifier).logout();
                  if (context.mounted) {
                    context.go('/login');
                  }
                },
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFFEF4444).withValues(alpha: 0.5),
                      width: 1.2,
                    ),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.logout_rounded,
                        color: Color(0xFFEF4444),
                        size: 20,
                      ),
                      SizedBox(width: 10),
                      Text(
                        'Log Out',
                        style: TextStyle(
                          color: Color(0xFFEF4444),
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerTile({
    required BuildContext context,
    required IconData icon,
    required String title,
    required String route,
    required String currentRoute,
  }) {
    final bool isSelected = currentRoute == route ||
        (route != '/dashboard' && currentRoute.startsWith(route)) ||
        (route == '/dashboard' && (currentRoute == '/' || currentRoute == '/dashboard'));

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.pop(context);
            if (!isSelected) {
              context.push(route);
            }
          },
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isSelected ? const Color(0xFF00D5CF) : Colors.transparent,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Icon(
                  icon,
                  color: isSelected ? Colors.white : const Color(0xFF94A3B8),
                  size: 22,
                ),
                const SizedBox(width: 16),
                Text(
                  title,
                  style: TextStyle(
                    color: isSelected ? Colors.white : const Color(0xFFCBD5E1),
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    fontSize: 15,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
