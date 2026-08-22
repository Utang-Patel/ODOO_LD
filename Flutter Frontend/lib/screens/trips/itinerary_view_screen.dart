import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../core/widgets/app_button.dart';
import '../../layouts/dashboard_layout.dart';
import '../../providers/trip_provider.dart';
import '../../widgets/animated_card.dart';

/// Full Read-Only / Presentation Itinerary View for a planned trip
class ItineraryViewScreen extends ConsumerWidget {
  final String tripId;

  const ItineraryViewScreen({
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
        title: 'Itinerary View',
        child: const Center(child: Text('Trip not found.')),
      );
    }

    final dateFormat = DateFormat('EEE, MMM d');

    return DashboardLayout(
      currentIndex: -1,
      showBackButton: true,
      title: 'Itinerary Overview',
      actions: [
        IconButton(
          icon: const Icon(Icons.share_rounded, color: AppColors.oceanBlue),
          onPressed: () => context.push('/shared/${trip.id}'),
          tooltip: 'Public Share Link',
        ),
      ],
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.only(bottom: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cover Image Banner
            Stack(
              children: [
                CachedNetworkImage(
                  imageUrl: trip.coverImageUrl,
                  height: 200,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
                Container(
                  height: 200,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.transparent,
                        AppColors.deepNavy.withValues(alpha: 0.8),
                      ],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
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
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: AppColors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${dateFormat.format(trip.startDate)} - ${dateFormat.format(trip.endDate)} (${trip.totalDays} Days)',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.borderLight,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Quick Actions Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: Row(
                children: [
                  Expanded(
                    child: AppButton(
                      text: 'Edit Builder',
                      onPressed: () => context.push('/itinerary/${trip.id}'),
                      variant: AppButtonVariant.secondary,
                      height: 42,
                      icon: Icons.edit_note_rounded,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: AppButton(
                      text: 'Budget View',
                      onPressed: () => context.push('/budget/${trip.id}'),
                      variant: AppButtonVariant.gradient,
                      height: 42,
                      icon: Icons.pie_chart_outline_rounded,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Stops & Timeline Schedule
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: const Text(
                'Complete Travel Timeline',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textMain,
                ),
              ),
            ),

            const SizedBox(height: 12),

            if (trip.itineraryItems.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
                child: AnimatedCard(
                  child: Column(
                    children: [
                      const Text(
                        'No detailed itinerary items created yet.',
                        style: TextStyle(color: AppColors.textMuted),
                      ),
                      const SizedBox(height: 12),
                      AppButton(
                        text: 'Open Itinerary Builder',
                        onPressed: () => context.push('/itinerary/${trip.id}'),
                        variant: AppButtonVariant.outline,
                        height: 40,
                      ),
                    ],
                  ),
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
                itemCount: trip.itineraryItems.length,
                separatorBuilder: (context, index) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final item = trip.itineraryItems[index];
                  return AnimatedCard(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: item.isCompleted
                                ? AppColors.tropicalGreen.withValues(alpha: 0.15)
                                : AppColors.oceanBlue.withValues(alpha: 0.15),
                          ),
                          child: Icon(
                            item.isCompleted ? Icons.check_circle_rounded : Icons.flight_takeoff_rounded,
                            size: 18,
                            color: item.isCompleted ? AppColors.tropicalGreen : AppColors.oceanBlue,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Day ${item.dayNumber} • ${item.timeSlot}',
                                    style: const TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.oceanBlue,
                                    ),
                                  ),
                                  if (item.cost > 0)
                                    Text(
                                      '\$${item.cost.toInt()}',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w700,
                                        color: AppColors.textMain,
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                item.title,
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.textMain,
                                ),
                              ),
                              if (item.description.isNotEmpty) ...[
                                const SizedBox(height: 2),
                                Text(
                                  item.description,
                                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}
