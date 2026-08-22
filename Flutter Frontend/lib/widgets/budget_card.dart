import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';
import '../models/trip.dart';
import 'animated_card.dart';

/// Budget card summarizing total budget, spent funds, and remaining balance with visual progress
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

    return AnimatedCard(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.sunsetOrange.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
                    ),
                    child: const Icon(
                      Icons.account_balance_wallet_outlined,
                      color: AppColors.sunsetOrange,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 10),
                  const Text(
                    'Trip Budget',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textMain,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: (isOverBudget ? AppColors.danger : AppColors.tropicalGreen)
                      .withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                ),
                child: Text(
                  '${(progress * 100).toInt()}% Used',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: isOverBudget ? AppColors.danger : AppColors.tropicalGreen,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(AppConstants.radiusFull),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 8,
              backgroundColor: AppColors.border,
              valueColor: AlwaysStoppedAnimation<Color>(
                isOverBudget ? AppColors.danger : AppColors.oceanBlue,
              ),
            ),
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildBudgetColumn('Spent', currencyFormatter.format(trip.spent), AppColors.textMain),
              _buildBudgetColumn(
                'Remaining',
                currencyFormatter.format(trip.remainingBudget > 0 ? trip.remainingBudget : 0),
                trip.remainingBudget > 0 ? AppColors.tropicalGreen : AppColors.danger,
              ),
              _buildBudgetColumn('Total Budget', currencyFormatter.format(trip.budget), AppColors.textSecondary),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBudgetColumn(String label, String value, Color valueColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 11,
            color: AppColors.textMuted,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: valueColor,
          ),
        ),
      ],
    );
  }
}
