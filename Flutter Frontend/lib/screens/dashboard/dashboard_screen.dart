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

/// Main Home / Dashboard screen showcasing the Globe, Hero section, active trip, and destination highlights
class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tripState = ref.watch(tripProvider);
    final authState = ref.watch(authProvider);
    final user = authState.user;
    final currentTrip = tripState.currentTrip;

    return DashboardLayout(
      currentIndex: 0,
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.only(bottom: 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Section with Aurora Background & 3D Globe
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppConstants.paddingLarge),
              decoration: const BoxDecoration(
                gradient: AppColors.heroGradient,
                borderRadius: BorderRadius.vertical(
                  bottom: Radius.circular(AppConstants.radiusLarge),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // User Welcome
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hello, ${user?.name.split(' ').first ?? 'Explorer'} 👋',
                            style: const TextStyle(
                              color: AppColors.aqua,
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            AppStrings.appHeroTitle,
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.w800,
                              color: AppColors.white,
                              letterSpacing: -0.5,
                              height: 1.2,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    AppStrings.appHeroSubtitle,
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.borderLight,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 16),
                  // CTA Buttons
                  Row(
                    children: [
                      Expanded(
                        child: AppButton(
                          text: '+ ${AppStrings.planNewTrip}',
                          onPressed: () => context.push('/create-trip'),
                          variant: AppButtonVariant.gradient,
                          height: 46,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: AppButton(
                          text: 'Explore Cities',
                          onPressed: () => context.go('/cities'),
                          variant: AppButtonVariant.outline,
                          height: 46,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  // 3D Globe Feature Showcase
                  const GlobeWidget(size: 260),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Travel Milestones Stats Row
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: Row(
                children: [
                  Expanded(
                    child: StatCard(
                      title: 'Trips Planned',
                      value: '${user?.tripsCount ?? 8}',
                      icon: Icons.luggage_rounded,
                      iconColor: AppColors.oceanBlue,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: StatCard(
                      title: 'Countries Visited',
                      value: '${user?.countriesCount ?? 14}',
                      icon: Icons.public_rounded,
                      iconColor: AppColors.tropicalGreen,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: StatCard(
                      title: 'Travel Score',
                      value: '${user?.travelScore.toInt() ?? 920}',
                      icon: Icons.military_tech_rounded,
                      iconColor: AppColors.sunsetOrange,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Active Travel Route Section
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

            // Upcoming Trips Section Header
            PageHeader(
              title: AppStrings.upcomingTrips,
              subtitle: 'Your active and scheduled journeys',
              trailing: TextButton(
                onPressed: () => context.go('/my-trips'),
                child: const Text('View All'),
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

            const SizedBox(height: 20),

            // Budget Highlight Card
            if (currentTrip != null) ...[
              PageHeader(
                title: 'Active Trip Budget',
                subtitle: currentTrip.title,
                trailing: TextButton(
                  onPressed: () => context.push('/budget/${currentTrip.id}'),
                  child: const Text('Details'),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
                child: BudgetCard(
                  trip: currentTrip,
                  onTap: () => context.push('/budget/${currentTrip.id}'),
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Recommended Destinations Carousel
            PageHeader(
              title: AppStrings.recommendedDestinations,
              subtitle: 'Hand-picked destinations for your bucket list',
              trailing: TextButton(
                onPressed: () => context.go('/cities'),
                child: const Text('Discover'),
              ),
            ),

            SizedBox(
              height: 260,
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
}
