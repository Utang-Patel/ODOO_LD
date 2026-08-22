import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../core/widgets/app_button.dart';
import '../../layouts/dashboard_layout.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/animated_card.dart';
import '../../widgets/page_header.dart';
import '../../widgets/stat_card.dart';

/// User profile, travel passport milestones, and application settings screen
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return DashboardLayout(
      currentIndex: 4,
      showBackButton: true,
      title: 'Traveler Passport',
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.only(bottom: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile Card Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppConstants.paddingLarge),
              decoration: const BoxDecoration(
                gradient: AppColors.heroGradient,
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 44,
                    backgroundColor: AppColors.aqua,
                    child: CircleAvatar(
                      radius: 41,
                      backgroundImage: user?.avatarUrl.isNotEmpty == true
                          ? CachedNetworkImageProvider(user!.avatarUrl)
                          : null,
                      child: user == null || user.avatarUrl.isEmpty
                          ? const Icon(Icons.person, size: 40, color: AppColors.white)
                          : null,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    user?.name ?? 'Alex Morgan',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppColors.white,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    user?.email ?? 'alex.morgan@wanderlust.io',
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.borderLight,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.aqua.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                      border: Border.all(color: AppColors.aqua.withValues(alpha: 0.5)),
                    ),
                    child: const Text(
                      '⭐ Verified GlobeTrotter Explorer',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppColors.aqua,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Passport Stats Grid
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: Row(
                children: [
                  Expanded(
                    child: StatCard(
                      title: 'Trips Taken',
                      value: '${user?.tripsCount ?? 8}',
                      icon: Icons.luggage_rounded,
                      iconColor: AppColors.oceanBlue,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: StatCard(
                      title: 'Countries',
                      value: '${user?.countriesCount ?? 14}',
                      icon: Icons.public_rounded,
                      iconColor: AppColors.tropicalGreen,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: StatCard(
                      title: 'Cities',
                      value: '${user?.citiesCount ?? 28}',
                      icon: Icons.location_city_rounded,
                      iconColor: AppColors.sunsetOrange,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Bio
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: AnimatedCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Traveler Bio',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      user?.bio ?? 'Passionate wanderer & cultural explorer.',
                      style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Settings & Preferences
            const PageHeader(
              title: 'Preferences & Settings',
              subtitle: 'Customize currency, language, and notification alerts',
            ),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: AnimatedCard(
                padding: EdgeInsets.zero,
                child: Column(
                  children: [
                    _buildSettingsTile(
                      icon: Icons.currency_exchange_rounded,
                      title: 'Primary Currency',
                      value: 'USD (\$)',
                    ),
                    const Divider(height: 1),
                    _buildSettingsTile(
                      icon: Icons.language_rounded,
                      title: 'Language',
                      value: 'English (US)',
                    ),
                    const Divider(height: 1),
                    _buildSettingsTile(
                      icon: Icons.notifications_active_outlined,
                      title: 'Travel Alerts & Flight Updates',
                      value: 'Enabled',
                    ),
                    const Divider(height: 1),
                    _buildSettingsTile(
                      icon: Icons.bookmark_border_rounded,
                      title: 'Saved Destinations',
                      value: '12 Places',
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Logout Button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: AppButton(
                text: 'Sign Out of GlobeTrotter',
                onPressed: () async {
                  await ref.read(authProvider.notifier).logout();
                  if (context.mounted) {
                    context.go('/login');
                  }
                },
                variant: AppButtonVariant.outline,
                icon: Icons.logout_rounded,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsTile({
    required IconData icon,
    required String title,
    required String value,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppColors.oceanBlue, size: 22),
      title: Text(
        title,
        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textMain),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            value,
            style: const TextStyle(fontSize: 13, color: AppColors.textMuted),
          ),
          const SizedBox(width: 6),
          const Icon(Icons.chevron_right, size: 18, color: AppColors.textMuted),
        ],
      ),
      onTap: () {},
    );
  }
}
