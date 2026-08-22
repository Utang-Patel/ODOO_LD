import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../layouts/dashboard_layout.dart';
import '../../providers/trip_provider.dart';
import '../../widgets/animated_card.dart';
import '../../widgets/page_header.dart';
import '../../widgets/stat_card.dart';

/// Budget & Cost Breakdown screen with FLChart analytics and itemized expenses
class BudgetScreen extends ConsumerWidget {
  final String tripId;

  const BudgetScreen({
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
        title: 'Trip Budget',
        child: const Center(child: Text('Trip not found.')),
      );
    }

    final currencyFormat = NumberFormat.simpleCurrency(name: trip.currency);
    final dateFormat = DateFormat('MMM d, yyyy');

    // Aggregate expenses by category
    final Map<String, double> categorySums = {};
    for (final exp in trip.expenses) {
      categorySums[exp.category] = (categorySums[exp.category] ?? 0) + exp.amount;
    }

    return DashboardLayout(
      currentIndex: -1,
      showBackButton: true,
      title: 'Budget & Cost Breakdown',
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.only(bottom: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            PageHeader(
              title: trip.title,
              subtitle: 'Real-time financial analytics and itemized expense ledger',
            ),

            // Top Budget Stats Row
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: Row(
                children: [
                  Expanded(
                    child: StatCard(
                      title: 'Total Budget',
                      value: currencyFormat.format(trip.budget),
                      icon: Icons.account_balance_wallet_outlined,
                      iconColor: AppColors.oceanBlue,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: StatCard(
                      title: 'Total Spent',
                      value: currencyFormat.format(trip.spent),
                      icon: Icons.payments_outlined,
                      iconColor: AppColors.sunsetOrange,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: StatCard(
                      title: 'Remaining',
                      value: currencyFormat.format(trip.remainingBudget > 0 ? trip.remainingBudget : 0),
                      icon: Icons.savings_outlined,
                      iconColor: AppColors.tropicalGreen,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // FLChart Pie Chart Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: AnimatedCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Spending by Category',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textMain,
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      height: 180,
                      child: Row(
                        children: [
                          Expanded(
                            flex: 5,
                            child: PieChart(
                              PieChartData(
                                sectionsSpace: 3,
                                centerSpaceRadius: 36,
                                sections: _buildPieSections(categorySums, trip.spent),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            flex: 4,
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: categorySums.entries.map((entry) {
                                final color = _getCategoryColor(entry.key);
                                return Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 4.0),
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 10,
                                        height: 10,
                                        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                                      ),
                                      const SizedBox(width: 6),
                                      Expanded(
                                        child: Text(
                                          entry.key,
                                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      Text(
                                        '\$${entry.value.toInt()}',
                                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                                      ),
                                    ],
                                  ),
                                );
                              }).toList(),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Itemized Expenses List
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Recorded Expenses',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textMain,
                    ),
                  ),
                  TextButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Add Expense modal ready for Phase 6 API sync!'),
                          backgroundColor: AppColors.oceanBlue,
                        ),
                      );
                    },
                    icon: const Icon(Icons.add, size: 16),
                    label: const Text('Add Expense'),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 8),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              itemCount: trip.expenses.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final expense = trip.expenses[index];
                final color = _getCategoryColor(expense.category);

                return AnimatedCard(
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: color.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
                        ),
                        child: Icon(_getCategoryIcon(expense.category), color: color, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              expense.title,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textMain,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${expense.category} • ${dateFormat.format(expense.date)} • ${expense.paymentMethod}',
                              style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        currencyFormat.format(expense.amount),
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textMain,
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

  List<PieChartSectionData> _buildPieSections(Map<String, double> sums, double total) {
    if (sums.isEmpty || total <= 0) {
      return [
        PieChartSectionData(
          color: AppColors.oceanBlue,
          value: 100,
          title: '100%',
          radius: 38,
          titleStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.white),
        ),
      ];
    }

    return sums.entries.map((entry) {
      final percentage = (entry.value / total * 100).toInt();
      final color = _getCategoryColor(entry.key);
      return PieChartSectionData(
        color: color,
        value: entry.value,
        title: '$percentage%',
        radius: 38,
        titleStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.white),
      );
    }).toList();
  }

  Color _getCategoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'flights':
        return AppColors.oceanBlue;
      case 'stays':
        return AppColors.sunsetOrange;
      case 'food':
        return AppColors.goldenYellow;
      case 'activities':
        return AppColors.aqua;
      case 'transport':
        return AppColors.tropicalGreen;
      default:
        return AppColors.deepNavy;
    }
  }

  IconData _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'flights':
        return Icons.flight_takeoff_rounded;
      case 'stays':
        return Icons.hotel_rounded;
      case 'food':
        return Icons.restaurant_rounded;
      case 'activities':
        return Icons.local_activity_rounded;
      case 'transport':
        return Icons.directions_train_rounded;
      default:
        return Icons.receipt_long_rounded;
    }
  }
}
