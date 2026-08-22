import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';
import '../models/trip.dart';
import 'animated_card.dart';

/// Budget card summarizing total budget, spent funds, and category allocations matching React Dashboard Budget
class BudgetCard extends StatelessWidget {
  final Trip trip;
  final VoidCallback? onTap;

  const BudgetCard({
    super.key,
    required this.trip,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final currencyFormatter = NumberFormat.simpleCurrency(name: trip.currency);
    final progress = trip.budgetProgress;
    final isOverBudget = trip.spent > trip.budget;
    final remaining = trip.remainingBudget > 0 ? trip.remainingBudget : 0.0;
    final progressPercentage = (progress * 100).toInt();

    // Calculate category totals from expenses or proportional allocation
    double transport = 0;
    double accommodation = 0;
    double activities = 0;
    double meals = 0;

    for (final exp in trip.expenses) {
      final cat = exp.category.toLowerCase();
      if (cat.contains('flight') || cat.contains('transport')) {
        transport += exp.amount;
      } else if (cat.contains('stay') || cat.contains('hotel') || cat.contains('accommodation')) {
        accommodation += exp.amount;
      } else if (cat.contains('activity') || cat.contains('tour')) {
        activities += exp.amount;
      } else if (cat.contains('food') || cat.contains('meal')) {
        meals += exp.amount;
      } else {
        transport += exp.amount;
      }
    }

    // Default breakdown if expenses are empty
    if (trip.expenses.isEmpty && trip.spent > 0) {
      transport = trip.spent * 0.35;
      accommodation = trip.spent * 0.30;
      activities = trip.spent * 0.20;
      meals = trip.spent * 0.15;
    }

    return AnimatedCard(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Active Trip Title & Total Budget
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceHover,
                        borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Text(
                        'Active: ${trip.title}',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.secondary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      currencyFormatter.format(trip.budget),
                      style: const TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textMain,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const Text(
                      'Estimated Total Budget',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textMuted,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              // Spent vs Remaining Compact Card
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppColors.bgPrimary,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.borderGlass),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Spent',
                          style: TextStyle(fontSize: 10, color: AppColors.textMuted, fontWeight: FontWeight.w600),
                        ),
                        Text(
                          currencyFormatter.format(trip.spent),
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textMain,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      height: 26,
                      width: 1,
                      color: AppColors.borderGlass,
                      margin: const EdgeInsets.symmetric(horizontal: 10),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Left',
                          style: TextStyle(fontSize: 10, color: AppColors.textMuted, fontWeight: FontWeight.w600),
                        ),
                        Text(
                          currencyFormatter.format(remaining),
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: isOverBudget ? AppColors.danger : AppColors.emerald,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          // Progress Bar Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Budget Allocation',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textMuted,
                ),
              ),
              Text(
                '$progressPercentage% Spent',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: AppColors.secondary,
                ),
              ),
            ],
          ),

          const SizedBox(height: 6),

          // SaaS Gradient Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Stack(
              children: [
                Container(
                  height: 10,
                  width: double.infinity,
                  color: AppColors.bgPrimary,
                ),
                FractionallySizedBox(
                  widthFactor: progress.clamp(0.0, 1.0),
                  child: Container(
                    height: 10,
                    decoration: const BoxDecoration(
                      gradient: AppColors.saasGradient,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 18),
          const Divider(color: Color(0x26CBD5E1), height: 1),
          const SizedBox(height: 14),

          // Category Allocation Badges Grid
          Row(
            children: [
              _buildCategoryBox('Transport', currencyFormatter.format(transport), Icons.flight_rounded, AppColors.primary),
              const SizedBox(width: 8),
              _buildCategoryBox('Stays', currencyFormatter.format(accommodation), Icons.hotel_rounded, AppColors.secondary),
              const SizedBox(width: 8),
              _buildCategoryBox('Activities', currencyFormatter.format(activities), Icons.confirmation_number_rounded, AppColors.accent),
              const SizedBox(width: 8),
              _buildCategoryBox('Meals', currencyFormatter.format(meals), Icons.restaurant_rounded, AppColors.supporting),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryBox(String name, String amount, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
        decoration: BoxDecoration(
          color: AppColors.bgPrimary.withValues(alpha: 0.6),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.borderGlass),
        ),
        child: Column(
          children: [
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 14, color: color),
            ),
            const SizedBox(height: 6),
            Text(
              name,
              style: const TextStyle(
                fontSize: 10,
                color: AppColors.textMuted,
                fontWeight: FontWeight.w600,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              amount,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                color: AppColors.textMain,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
