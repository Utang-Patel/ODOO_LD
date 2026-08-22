import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';
import '../models/trip.dart';
import 'animated_card.dart';

/// Premium glass card displaying an overview of a planned or upcoming trip matching React TripCard
class TripCard extends StatelessWidget {
  final Trip trip;
  final VoidCallback? onTap;
  final VoidCallback? onItineraryTap;
  final bool showActions;

  const TripCard({
    super.key,
    required this.trip,
    this.onTap,
    this.onItineraryTap,
    this.showActions = true,
  });

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('MMM d');
    final dateRange = '${dateFormat.format(trip.startDate)} - ${dateFormat.format(trip.endDate)} (${trip.totalDays}d)';
    final currencyFormat = NumberFormat.simpleCurrency(name: trip.currency);

    return AnimatedCard(
      padding: EdgeInsets.zero,
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Trip Cover Image & Badges
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(AppConstants.radiusMedium),
                ),
                child: CachedNetworkImage(
                  imageUrl: trip.coverImageUrl.isNotEmpty
                      ? trip.coverImageUrl
                      : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
                  height: 160,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    height: 160,
                    color: AppColors.surfaceHover,
                    child: const Center(child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary)),
                  ),
                  errorWidget: (context, url, error) => Container(
                    height: 160,
                    color: AppColors.bgSecondary,
                    child: const Icon(Icons.flight, color: AppColors.primary, size: 40),
                  ),
                ),
              ),
              // Dark Gradient Overlay for text legibility
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(AppConstants.radiusMedium),
                    ),
                    gradient: LinearGradient(
                      colors: [
                        Colors.black.withValues(alpha: 0.2),
                        AppColors.surface.withValues(alpha: 0.85),
                      ],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      stops: const [0.5, 1.0],
                    ),
                  ),
                ),
              ),
              // Status Badge
              Positioned(
                top: 12,
                left: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getStatusColor(trip.status),
                    borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.4),
                        blurRadius: 6,
                      ),
                    ],
                  ),
                  child: Text(
                    trip.status.name.toUpperCase(),
                    style: const TextStyle(
                      color: AppColors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.6,
                    ),
                  ),
                ),
              ),
              // Cities Count Badge
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.bgSecondary.withValues(alpha: 0.9),
                    borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                    border: Border.all(color: AppColors.borderGlass),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.location_on, size: 12, color: AppColors.supporting),
                      const SizedBox(width: 4),
                      Text(
                        '${trip.citiesCount} ${trip.citiesCount == 1 ? 'City' : 'Cities'}',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          Padding(
            padding: const EdgeInsets.all(AppConstants.paddingMedium),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title
                Text(
                  trip.title,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textMain,
                    letterSpacing: -0.3,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 6),
                // Dates
                Row(
                  children: [
                    const Icon(Icons.calendar_today_rounded, size: 13, color: AppColors.supporting),
                    const SizedBox(width: 6),
                    Text(
                      dateRange,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                if (trip.stops.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  // City Route Chips
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: trip.stops.map((stop) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceHover,
                          borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
                          border: Border.all(color: AppColors.borderGlass),
                        ),
                        child: Text(
                          stop.city.name,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],
                const SizedBox(height: 12),
                const Divider(color: Color(0x26CBD5E1), height: 1),
                const SizedBox(height: 12),
                // Budget & CTA
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Estimated Budget',
                          style: TextStyle(
                            fontSize: 11,
                            color: AppColors.textMuted,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          currencyFormat.format(trip.budget),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: AppColors.secondary,
                            letterSpacing: -0.2,
                          ),
                        ),
                      ],
                    ),
                    if (showActions)
                      InkWell(
                        onTap: onItineraryTap ?? onTap,
                        borderRadius: BorderRadius.circular(AppConstants.radiusSmall + 2),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                          decoration: BoxDecoration(
                            gradient: AppColors.indigoGradient,
                            borderRadius: BorderRadius.circular(AppConstants.radiusSmall + 2),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.primary.withValues(alpha: 0.35),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.map_outlined, size: 14, color: Colors.white),
                              SizedBox(width: 6),
                              Text(
                                'Itinerary',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(TripStatus status) {
    switch (status) {
      case TripStatus.planning:
        return AppColors.accent;
      case TripStatus.upcoming:
        return AppColors.primary;
      case TripStatus.ongoing:
        return AppColors.emerald;
      case TripStatus.completed:
        return AppColors.textMuted;
    }
  }
}
