import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../layouts/dashboard_layout.dart';
import '../../widgets/animated_card.dart';
import '../../widgets/page_header.dart';
import '../../widgets/stat_card.dart';

/// Optional Admin & Analytics Dashboard for hackathon presentation demo
class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      currentIndex: -1,
      showBackButton: true,
      title: 'Platform Analytics',
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.only(bottom: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const PageHeader(
              title: 'GlobeTrotter Insights 📊',
              subtitle: 'Platform-wide travel metrics, itinerary traffic, and destination trends',
              tag: 'ADMIN PANEL',
              tagColor: AppColors.sunsetOrange,
            ),

            // Top Metrics Row
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: Row(
                children: [
                  Expanded(
                    child: StatCard(
                      title: 'Active Users',
                      value: '14.2k',
                      icon: Icons.people_alt_rounded,
                      iconColor: AppColors.oceanBlue,
                    ),
                  ),
                  SizedBox(width: 10),
                  Expanded(
                    child: StatCard(
                      title: 'Trips Created',
                      value: '38.6k',
                      icon: Icons.flight_takeoff_rounded,
                      iconColor: AppColors.tropicalGreen,
                    ),
                  ),
                  SizedBox(width: 10),
                  Expanded(
                    child: StatCard(
                      title: 'Destinations',
                      value: '420+',
                      icon: Icons.map_rounded,
                      iconColor: AppColors.sunsetOrange,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Monthly Growth Chart Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: AnimatedCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Monthly Trip Creations (2026)',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textMain,
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      height: 160,
                      child: BarChart(
                        BarChartData(
                          alignment: BarChartAlignment.spaceAround,
                          maxY: 20,
                          barTouchData: BarTouchData(enabled: true),
                          titlesData: FlTitlesData(
                            leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            bottomTitles: AxisTitles(
                              sideTitles: SideTitles(
                                showTitles: true,
                                getTitlesWidget: (val, meta) {
                                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                                  final idx = val.toInt();
                                  if (idx >= 0 && idx < months.length) {
                                    return Text(months[idx], style: const TextStyle(fontSize: 11));
                                  }
                                  return const SizedBox.shrink();
                                },
                              ),
                            ),
                          ),
                          borderData: FlBorderData(show: false),
                          barGroups: [
                            _makeBarGroup(0, 8),
                            _makeBarGroup(1, 11),
                            _makeBarGroup(2, 14),
                            _makeBarGroup(3, 13),
                            _makeBarGroup(4, 17),
                            _makeBarGroup(5, 19),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Trending Multi-City Routes
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: Text(
                'Top Trending Multi-City Routes',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textMain,
                ),
              ),
            ),

            const SizedBox(height: 10),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: Column(
                children: const [
                  _RouteMetricTile(
                    route: 'Paris ➔ Zurich ➔ Rome',
                    tripsCount: '4,280 trips',
                    growth: '+28%',
                  ),
                  SizedBox(height: 8),
                  _RouteMetricTile(
                    route: 'Tokyo ➔ Kyoto ➔ Osaka',
                    tripsCount: '3,840 trips',
                    growth: '+34%',
                  ),
                  SizedBox(height: 8),
                  _RouteMetricTile(
                    route: 'Bali ➔ Lombok ➔ Gili Islands',
                    tripsCount: '2,920 trips',
                    growth: '+19%',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  BarChartGroupData _makeBarGroup(int x, double y) {
    return BarChartGroupData(
      x: x,
      barRods: [
        BarChartRodData(
          toY: y,
          gradient: AppColors.primaryGradient,
          width: 18,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
        ),
      ],
    );
  }
}

class _RouteMetricTile extends StatelessWidget {
  final String route;
  final String tripsCount;
  final String growth;

  const _RouteMetricTile({
    required this.route,
    required this.tripsCount,
    required this.growth,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedCard(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Icon(Icons.flight_takeoff_rounded, size: 18, color: AppColors.oceanBlue),
              const SizedBox(width: 10),
              Text(
                route,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textMain,
                ),
              ),
            ],
          ),
          Row(
            children: [
              Text(
                tripsCount,
                style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.tropicalGreen.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                ),
                child: Text(
                  growth,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppColors.tropicalGreen,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
