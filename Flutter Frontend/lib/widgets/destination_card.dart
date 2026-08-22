import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';
import '../models/city.dart';

/// Premium destination card featuring destination imagery, rating, tag, and cost matching React DestinationCard
class DestinationCard extends StatelessWidget {
  final City city;
  final VoidCallback? onTap;
  final double width;
  final double height;
  final bool showCost;
  final bool isSaved;

  const DestinationCard({
    super.key,
    required this.city,
    this.onTap,
    this.width = 220.0,
    this.height = 280.0,
    this.showCost = true,
    this.isSaved = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
        border: Border.all(color: AppColors.borderGlass),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.35),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Background Destination Image
            CachedNetworkImage(
              imageUrl: city.imageUrl.isNotEmpty
                  ? city.imageUrl
                  : 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(
                color: AppColors.surfaceHover,
                child: const Center(child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary)),
              ),
              errorWidget: (context, url, error) => Container(
                color: AppColors.bgSecondary,
                child: const Icon(Icons.location_city, color: AppColors.primary),
              ),
            ),
            // Gradient Overlay
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.transparent,
                    AppColors.bgPrimary.withValues(alpha: 0.4),
                    AppColors.bgPrimary.withValues(alpha: 0.95),
                  ],
                  stops: const [0.3, 0.65, 1.0],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),
            // Top Badges
            Positioned(
              top: 12,
              left: 12,
              right: 12,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      gradient: AppColors.saasGradient,
                      borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withValues(alpha: 0.35),
                          blurRadius: 6,
                        ),
                      ],
                    ),
                    child: Text(
                      city.tag,
                      style: const TextStyle(
                        color: AppColors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.3,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.bgSecondary.withValues(alpha: 0.9),
                      borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                      border: Border.all(color: AppColors.borderGlass),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.star_rounded, color: Color(0xFFFBBF24), size: 14),
                        const SizedBox(width: 3),
                        Text(
                          city.rating.toStringAsFixed(1),
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: AppColors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            // Bottom Info
            Positioned(
              bottom: 14,
              left: 14,
              right: 14,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    city.name,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppColors.white,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Row(
                    children: [
                      const Icon(Icons.location_on_rounded, size: 13, color: AppColors.supporting),
                      const SizedBox(width: 4),
                      Text(
                        city.country,
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                  if (showCost) ...[
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0x2606B6D4),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: const Color(0x5906B6D4)),
                      ),
                      child: Text(
                        'Avg \$${city.avgCostPerDay.toInt()} / day',
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.supporting,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            // Ripple tap target
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: onTap,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
