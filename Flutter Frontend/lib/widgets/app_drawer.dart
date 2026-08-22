import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';
import '../core/constants/app_strings.dart';
import '../providers/auth_provider.dart';

/// Secondary navigation drawer for extended actions and settings
class AppDrawer extends ConsumerWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Drawer(
      backgroundColor: AppColors.white,
      child: SafeArea(
        child: Column(
          children: [
            // User Header Profile Card
            Container(
              padding: const EdgeInsets.all(AppConstants.paddingLarge),
              decoration: const BoxDecoration(
                gradient: AppColors.heroGradient,
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: AppColors.aqua,
                    child: CircleAvatar(
                      radius: 26,
                      backgroundImage: user?.avatarUrl != null && user!.avatarUrl.isNotEmpty
                          ? CachedNetworkImageProvider(user.avatarUrl)
                          : null,
                      child: user == null || user.avatarUrl.isEmpty
                          ? const Icon(Icons.person, color: AppColors.white)
                          : null,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user?.name ?? 'Traveler',
                          style: const TextStyle(
                            color: AppColors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          user?.email ?? 'wanderer@globetrotter.io',
                          style: const TextStyle(
                            color: AppColors.borderLight,
                            fontSize: 12,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.aqua.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                            border: Border.all(color: AppColors.aqua.withValues(alpha: 0.4)),
                          ),
                          child: Text(
                            'Score: ${user?.travelScore.toInt() ?? 850} pts',
                            style: const TextStyle(
                              color: AppColors.aqua,
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Navigation Options
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 8),
                children: [
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.add_circle_outline_rounded,
                    title: 'Plan New Trip',
                    route: '/create-trip',
                    highlightColor: AppColors.oceanBlue,
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.account_balance_wallet_outlined,
                    title: 'Budget & Cost Breakdown',
                    route: '/budget/trip-001',
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.local_activity_outlined,
                    title: 'Experiences & Activities',
                    route: '/activities/city-paris',
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.share_location_outlined,
                    title: 'Shared Public Itinerary',
                    route: '/shared/trip-001',
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.admin_panel_settings_outlined,
                    title: 'Admin & Analytics (Demo)',
                    route: '/admin',
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Divider(height: 1),
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.settings_outlined,
                    title: AppStrings.navSettings,
                    route: '/profile',
                  ),
                  _buildDrawerTile(
                    context: context,
                    icon: Icons.help_outline_rounded,
                    title: 'Help & Documentation',
                    onTap: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('GlobeTrotter v1.0.0 — Empowering Personalized Travel'),
                          backgroundColor: AppColors.oceanBlue,
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),

            // Logout Action
            Padding(
              padding: const EdgeInsets.all(AppConstants.paddingMedium),
              child: ListTile(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
                  side: const BorderSide(color: AppColors.border),
                ),
                leading: const Icon(Icons.logout_rounded, color: AppColors.danger),
                title: const Text(
                  AppStrings.navLogout,
                  style: TextStyle(
                    color: AppColors.danger,
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
                onTap: () async {
                  Navigator.pop(context);
                  await ref.read(authProvider.notifier).logout();
                  if (context.mounted) {
                    context.go('/login');
                  }
                },
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
    String? route,
    VoidCallback? onTap,
    Color? highlightColor,
  }) {
    return ListTile(
      leading: Icon(icon, color: highlightColor ?? AppColors.textSecondary, size: 22),
      title: Text(
        title,
        style: TextStyle(
          color: highlightColor ?? AppColors.textMain,
          fontWeight: highlightColor != null ? FontWeight.w700 : FontWeight.w500,
          fontSize: 14,
        ),
      ),
      onTap: () {
        Navigator.pop(context);
        if (onTap != null) {
          onTap();
        } else if (route != null) {
          context.push(route);
        }
      },
    );
  }
}
