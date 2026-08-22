import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../core/constants/app_strings.dart';
import '../../core/widgets/app_button.dart';
import '../../layouts/dashboard_layout.dart';
import '../../providers/auth_provider.dart';
import '../../providers/trip_provider.dart';
import '../../widgets/budget_card.dart';
import '../../widgets/destination_card.dart';
import '../../widgets/globe_widget.dart';
import '../../widgets/page_header.dart';
import '../../widgets/route_preview.dart';
import '../../widgets/stat_card.dart';
import '../../widgets/trip_card.dart';

/// Main Home / Dashboard screen matching the React Frontend Deep Dark Cyber SaaS design
class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tripState = ref.watch(tripProvider);
    final authState = ref.watch(authProvider);
    final user = authState.user;
    final currentTrip = tripState.currentTrip;
    final firstTripId = currentTrip?.id;

    return DashboardLayout(
      currentIndex: 0,
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.only(bottom: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. HERO / WELCOME SECTION WITH AMBIENT GLOWING MESH
            Padding(
              padding: const EdgeInsets.all(AppConstants.paddingMedium),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppConstants.paddingLarge),
                decoration: BoxDecoration(
                  color: AppColors.bgSecondary.withValues(alpha: 0.85),
                  borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
                  border: Border.all(color: AppColors.borderGlass),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.4),
                      blurRadius: 30,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    // Ambient Glowing Violet Gradient Blob
                    Positioned(
                      top: -40,
                      left: -40,
                      child: Container(
                        width: 180,
                        height: 180,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.primary.withValues(alpha: 0.18),
                        ),
                      ),
                    ),
                    // Ambient Glowing Pink Gradient Blob
                    Positioned(
                      bottom: -40,
                      right: -40,
                      child: Container(
                        width: 160,
                        height: 160,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.secondary.withValues(alpha: 0.15),
                        ),
                      ),
                    ),

                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Dynamic Time Greeting Badge
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                          decoration: BoxDecoration(
                            gradient: AppColors.saasGradient,
                            borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.primary.withValues(alpha: 0.4),
                                blurRadius: 10,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Text(
                            '${_getGreeting()}, ${user?.name.split(' ').first ?? 'Explorer'} 👋',
                            style: const TextStyle(
                              color: AppColors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.2,
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),
                        const Text(
                          AppStrings.appHeroTitle,
                          style: TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            color: AppColors.white,
                            letterSpacing: -0.6,
                            height: 1.2,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          AppStrings.appHeroSubtitle,
                          style: TextStyle(
                            fontSize: 13,
                            color: AppColors.textSecondary,
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 18),
                        // Action Buttons
                        Row(
                          children: [
                            Expanded(
                              child: AppButton(
                                text: '+ ${AppStrings.planNewTrip}',
                                onPressed: () => context.push('/create-trip'),
                                variant: AppButtonVariant.gradient,
                                height: 44,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: AppButton(
                                text: 'Explore Cities',
                                onPressed: () => context.go('/cities'),
                                variant: AppButtonVariant.outline,
                                height: 44,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 18),
                        // Interactive Globe
                        const Center(child: GlobeWidget(size: 200)),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // 2. QUICK ACTION TILES (Plan, Explore, Calendar, Budget)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: Row(
                children: [
                  _buildQuickTile(
                    context: context,
                    icon: Icons.add_circle_outline_rounded,
                    title: 'Plan Trip',
                    gradient: AppColors.saasGradient,
                    onTap: () => context.push('/create-trip'),
                  ),
                  const SizedBox(width: 8),
                  _buildQuickTile(
                    context: context,
                    icon: Icons.language_rounded,
                    title: 'Explore',
                    gradient: AppColors.indigoGradient,
                    onTap: () => context.go('/cities'),
                  ),
                  const SizedBox(width: 8),
                  _buildQuickTile(
                    context: context,
                    icon: Icons.calendar_month_rounded,
                    title: 'Calendar',
                    gradient: AppColors.cyanGradient,
                    onTap: () => context.push(firstTripId != null ? '/calendar/$firstTripId' : '/my-trips'),
                  ),
                  const SizedBox(width: 8),
                  _buildQuickTile(
                    context: context,
                    icon: Icons.account_balance_wallet_rounded,
                    title: 'Budget',
                    gradient: AppColors.sunsetGradient,
                    onTap: () => context.push(firstTripId != null ? '/budget/$firstTripId' : '/my-trips'),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // 3. TRAVEL MILESTONES STATS ROW
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: Row(
                children: [
                  Expanded(
                    child: StatCard(
                      title: 'Trips Planned',
                      value: '${user?.tripsCount ?? tripState.trips.length}',
                      icon: Icons.luggage_rounded,
                      iconColor: AppColors.primary,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: StatCard(
                      title: 'Countries',
                      value: '${user?.countriesCount ?? 14}',
                      icon: Icons.public_rounded,
                      iconColor: AppColors.emerald,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: StatCard(
                      title: 'Travel Score',
                      value: '${user?.travelScore.toInt() ?? 920}',
                      icon: Icons.military_tech_rounded,
                      iconColor: AppColors.accent,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // 4. ACTIVE TRAVEL ROUTE PREVIEW
            if (currentTrip != null && currentTrip.stops.isNotEmpty) ...[
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
                child: RoutePreview(
                  stops: currentTrip.stops,
                  onTap: () => context.push('/itinerary/${currentTrip.id}'),
                ),
              ),
              const SizedBox(height: 20),
            ],

            // 5. YOUR TRIPS SECTION
            PageHeader(
              title: AppStrings.upcomingTrips,
              subtitle: 'Recent and upcoming multi-city itineraries.',
              trailing: InkWell(
                onTap: () => context.go('/my-trips'),
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: const Color(0x1A7C3AED),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0x597C3AED)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'View All',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textMain,
                        ),
                      ),
                      SizedBox(width: 4),
                      Icon(Icons.arrow_forward_rounded, size: 13, color: AppColors.secondary),
                    ],
                  ),
                ),
              ),
            ),

            // Trip Cards List
            if (tripState.upcomingTrips.isNotEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
                child: ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: tripState.upcomingTrips.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 16),
                  itemBuilder: (context, index) {
                    final trip = tripState.upcomingTrips[index];
                    return TripCard(
                      trip: trip,
                      onTap: () => context.push('/itinerary/${trip.id}'),
                      onItineraryTap: () => context.push('/itinerary/${trip.id}/view'),
                    );
                  },
                ),
              ),

            const SizedBox(height: 24),

            // 6. REAL BUDGET HIGHLIGHTS
            if (currentTrip != null) ...[
              PageHeader(
                title: 'Trip Budget Highlights',
                subtitle: 'Real financial allocation summary for active trip.',
                trailing: InkWell(
                  onTap: () => context.push('/budget/${currentTrip.id}'),
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0x1A7C3AED),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0x597C3AED)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Breakdown',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textMain,
                          ),
                        ),
                        SizedBox(width: 4),
                        Icon(Icons.arrow_forward_rounded, size: 13, color: AppColors.secondary),
                      ],
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
                child: BudgetCard(
                  trip: currentTrip,
                  onTap: () => context.push('/budget/${currentTrip.id}'),
                ),
              ),
              const SizedBox(height: 24),
            ],

            // 7. EXPLORE DESTINATIONS SECTION
            PageHeader(
              title: 'Explore Destinations',
              subtitle: 'Real iconic cities fetched from database.',
              trailing: InkWell(
                onTap: () => context.go('/cities'),
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: const Color(0x1A7C3AED),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0x597C3AED)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Explore All',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textMain,
                        ),
                      ),
                      SizedBox(width: 4),
                      Icon(Icons.arrow_forward_rounded, size: 13, color: AppColors.secondary),
                    ],
                  ),
                ),
              ),
            ),

            SizedBox(
              height: 270,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                itemCount: tripState.cities.length,
                separatorBuilder: (context, index) => const SizedBox(width: 14),
                itemBuilder: (context, index) {
                  final city = tripState.cities[index];
                  return DestinationCard(
                    city: city,
                    onTap: () => context.push('/activities/${city.id}'),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickTile({
    required BuildContext context,
    required IconData icon,
    required String title,
    required LinearGradient gradient,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
              border: Border.all(color: AppColors.borderGlass),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    gradient: gradient,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: gradient.colors.first.withValues(alpha: 0.35),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Icon(icon, size: 19, color: Colors.white),
                ),
                const SizedBox(height: 8),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textMain,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
