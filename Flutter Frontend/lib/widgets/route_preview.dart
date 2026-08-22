import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';
import '../models/trip_stop.dart';

/// Interactive visual travel route connecting multi-city stops with flight vectors
class RoutePreview extends StatelessWidget {
  final List<TripStop> stops;
  final VoidCallback? onTap;

  const RoutePreview({
    super.key,
    required this.stops,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    if (stops.isEmpty) {
      return const SizedBox.shrink();
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppConstants.paddingMedium),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.alt_route_rounded, size: 18, color: AppColors.oceanBlue),
                  SizedBox(width: 8),
                  Text(
                    'Multi-City Route Preview',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textMain,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.oceanBlue.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                ),
                child: Text(
                  '${stops.length} Stops',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.oceanBlue,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          // Route Diagram with Stops & Flight Paths
          LayoutBuilder(
            builder: (context, constraints) {
              return SizedBox(
                height: 72,
                child: Stack(
                  alignment: Alignment.centerLeft,
                  children: [
                    // Connecting Route Line
                    Positioned(
                      left: 20,
                      right: 20,
                      top: 18,
                      child: Container(
                        height: 3,
                        decoration: BoxDecoration(
                          gradient: AppColors.primaryGradient,
                          borderRadius: BorderRadius.circular(2),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.oceanBlue.withValues(alpha: 0.3),
                              blurRadius: 6,
                              spreadRadius: 1,
                            ),
                          ],
                        ),
                      ),
                    ),
                    // Stops Row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: List.generate(stops.length, (index) {
                        final stop = stops[index];
                        final isFirst = index == 0;
                        final isLast = index == stops.length - 1;

                        return Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 36,
                              height: 36,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isFirst || isLast ? AppColors.oceanBlue : AppColors.white,
                                border: Border.all(
                                  color: AppColors.oceanBlue,
                                  width: 2.5,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.oceanBlue.withValues(alpha: 0.2),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Center(
                                child: isFirst
                                    ? const Icon(Icons.flight_takeoff_rounded, size: 16, color: AppColors.white)
                                    : isLast
                                        ? const Icon(Icons.flight_land_rounded, size: 16, color: AppColors.white)
                                        : Text(
                                            '${index + 1}',
                                            style: const TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.w700,
                                              color: AppColors.oceanBlue,
                                            ),
                                          ),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              stop.city.name,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textMain,
                              ),
                            ),
                            Text(
                              '${stop.daysCount}d stay',
                              style: const TextStyle(
                                fontSize: 10,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        );
                      }),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
