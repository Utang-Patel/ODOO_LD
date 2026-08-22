import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../core/widgets/app_button.dart';
import '../../layouts/dashboard_layout.dart';
import '../../providers/trip_provider.dart';
import '../../widgets/animated_card.dart';
import '../../widgets/route_preview.dart';

/// Public-facing shared itinerary showcase with clone trip action
class SharedTripScreen extends ConsumerWidget {
  final String tripId;

  const SharedTripScreen({
    super.key,
    required this.tripId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tripState = ref.watch(tripProvider);
    final trip = tripState.findTripById(tripId) ?? tripState.currentTrip;

    if (trip == null) {
      return DashboardLayout(
        currentIndex: -1,
        showBackButton: true,
        title: 'Shared Trip',
        child: const Center(child: Text('Shared trip not found.')),
      );
    }

    return DashboardLayout(
      currentIndex: -1,
      showBackButton: true,
      title: 'Shared Journey ✈️',
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.only(bottom: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Public Cover Banner
            Stack(
              children: [
                CachedNetworkImage(
                  imageUrl: trip.coverImageUrl,
                  height: 220,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
                Container(
                  height: 220,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.transparent,
                        AppColors.deepNavy.withValues(alpha: 0.9),
                      ],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                  ),
                ),
                Positioned(
                  top: 16,
                  left: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.aqua.withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.public_rounded, size: 14, color: AppColors.deepNavy),
                        SizedBox(width: 4),
                        Text(
                          'PUBLIC COMMUNITY TRIP',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: AppColors.deepNavy,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Positioned(
                  bottom: 16,
                  left: 16,
                  right: 16,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        trip.title,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          color: AppColors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.person_rounded, size: 14, color: AppColors.aqua),
                          const SizedBox(width: 4),
                          Text(
                            'Curated by ${trip.createdBy}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.borderLight,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Share & Clone Actions
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Copy & Customize Trip',
                      onPressed: () {
                        ref.read(tripProvider.notifier).addTrip(
                              trip.copyWith(
                                id: 'trip-${DateTime.now().millisecondsSinceEpoch}',
                                title: '${trip.title} (My Copy)',
                              ),
                            );
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Trip copied to your journeys! 🎉'),
                            backgroundColor: AppColors.tropicalGreen,
                          ),
                        );
                        context.go('/my-trips');
                      },
                      variant: AppButtonVariant.gradient,
                      height: 46,
                      icon: Icons.copy_rounded,
                    ),
                  ),
                  const SizedBox(width: 12),
                  SizedBox(
                    width: 50,
                    height: 46,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: EdgeInsets.zero,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
                        ),
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Trip link copied to clipboard! 📋'),
                            backgroundColor: AppColors.oceanBlue,
                          ),
                        );
                      },
                      child: const Icon(Icons.share_rounded, color: AppColors.oceanBlue),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Route Preview
            if (trip.stops.isNotEmpty) ...[
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
                child: RoutePreview(stops: trip.stops),
              ),
              const SizedBox(height: 20),
            ],

            // Trip Description
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: AnimatedCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'About This Journey',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textMain,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      trip.description,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildBadge(Icons.calendar_month, '${trip.totalDays} Days'),
                        _buildBadge(Icons.location_city, '${trip.stops.length} Cities'),
                        _buildBadge(Icons.attach_money, '\$${trip.budget.toInt()} Est.'),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Itinerary Highlights
            if (trip.itineraryItems.isNotEmpty) ...[
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
                child: Text(
                  'Featured Schedule Highlights',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textMain,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
                itemCount: trip.itineraryItems.take(4).length,
                separatorBuilder: (context, index) => const SizedBox(height: 8),
                itemBuilder: (context, index) {
                  final item = trip.itineraryItems[index];
                  return AnimatedCard(
                    child: Row(
                      children: [
                        const Icon(Icons.star_rounded, color: AppColors.goldenYellow, size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.title,
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.textMain,
                                ),
                              ),
                              Text(
                                'Day ${item.dayNumber} • ${item.location}',
                                style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildBadge(IconData icon, String label) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.oceanBlue),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: AppColors.textMain,
          ),
        ),
      ],
    );
  }
}
