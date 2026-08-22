import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../core/widgets/app_button.dart';
import '../../layouts/dashboard_layout.dart';
import '../../providers/trip_provider.dart';
import '../../widgets/animated_card.dart';

/// Interactive Itinerary Builder to assemble daily travel schedules and activities
class ItineraryBuilderScreen extends ConsumerStatefulWidget {
  final String tripId;

  const ItineraryBuilderScreen({
    super.key,
    required this.tripId,
  });

  @override
  ConsumerState<ItineraryBuilderScreen> createState() => _ItineraryBuilderScreenState();
}

class _ItineraryBuilderScreenState extends ConsumerState<ItineraryBuilderScreen> {
  int _selectedDay = 1;

  @override
  Widget build(BuildContext context) {
    final tripState = ref.watch(tripProvider);
    final trip = tripState.findTripById(widget.tripId) ?? tripState.currentTrip;

    if (trip == null) {
      return DashboardLayout(
        currentIndex: -1,
        showBackButton: true,
        title: 'Itinerary Builder',
        child: const Center(child: Text('Trip not found.')),
      );
    }

    final totalDays = trip.totalDays > 0 ? trip.totalDays : 5;
    final dayItems = trip.itineraryItems.where((item) => item.dayNumber == _selectedDay).toList();

    return DashboardLayout(
      currentIndex: -1,
      showBackButton: true,
      title: 'Itinerary Builder',
      actions: [
        IconButton(
          icon: const Icon(Icons.remove_red_eye_outlined, color: AppColors.oceanBlue),
          tooltip: 'Preview Itinerary',
          onPressed: () => context.push('/itinerary/${trip.id}/view'),
        ),
      ],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Trip Info Banner
          Container(
            padding: const EdgeInsets.all(AppConstants.paddingMedium),
            color: AppColors.white,
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.oceanBlue.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
                  ),
                  child: const Icon(Icons.edit_calendar_rounded, color: AppColors.oceanBlue, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        trip.title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textMain,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${trip.stops.length} Cities • $totalDays Days • \$${trip.budget.toInt()} Budget',
                        style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1),

          // Day Selector Scroll
          Container(
            height: 60,
            color: AppColors.white,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium, vertical: 8),
              scrollDirection: Axis.horizontal,
              itemCount: totalDays,
              separatorBuilder: (context, index) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final day = index + 1;
                final isSelected = day == _selectedDay;

                return ChoiceChip(
                  label: Text('Day $day'),
                  selected: isSelected,
                  onSelected: (_) => setState(() => _selectedDay = day),
                  selectedColor: AppColors.oceanBlue,
                  labelStyle: TextStyle(
                    color: isSelected ? AppColors.white : AppColors.textMain,
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 12),

          // Action Toolbar (Add Activity / View Calendar / View Budget)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
            child: Row(
              children: [
                Expanded(
                  child: AppButton(
                    text: '+ Add Activity',
                    onPressed: () => _showAddActivitySheet(context, trip.id),
                    variant: AppButtonVariant.gradient,
                    height: 40,
                  ),
                ),
                const SizedBox(width: 10),
                IconButton.filledTonal(
                  icon: const Icon(Icons.account_balance_wallet_outlined, size: 20),
                  onPressed: () => context.push('/budget/${trip.id}'),
                  tooltip: 'Budget Breakdown',
                ),
                IconButton.filledTonal(
                  icon: const Icon(Icons.calendar_month_outlined, size: 20),
                  onPressed: () => context.push('/calendar/${trip.id}'),
                  tooltip: 'Calendar Timeline',
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Scheduled Itinerary Items for selected day
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
            child: Text(
              'Schedule for Day $_selectedDay',
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: AppColors.textMain,
              ),
            ),
          ),

          const SizedBox(height: 8),

          Expanded(
            child: dayItems.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.event_note_outlined, size: 48, color: AppColors.textMuted),
                        const SizedBox(height: 10),
                        Text(
                          'No activities scheduled for Day $_selectedDay',
                          style: const TextStyle(fontSize: 14, color: AppColors.textMuted),
                        ),
                        const SizedBox(height: 14),
                        SizedBox(
                          width: 160,
                          child: AppButton(
                            text: 'Add First Item',
                            onPressed: () => _showAddActivitySheet(context, trip.id),
                            variant: AppButtonVariant.outline,
                            height: 38,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppConstants.paddingMedium,
                      vertical: 8,
                    ),
                    physics: const BouncingScrollPhysics(),
                    itemCount: dayItems.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = dayItems[index];
                      return AnimatedCard(
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppColors.oceanBlue.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
                              ),
                              child: Text(
                                item.timeSlot,
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.oceanBlue,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.title,
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.textMain,
                                    ),
                                  ),
                                  if (item.description.isNotEmpty) ...[
                                    const SizedBox(height: 4),
                                    Text(
                                      item.description,
                                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                                    ),
                                  ],
                                  const SizedBox(height: 6),
                                  Row(
                                    children: [
                                      const Icon(Icons.location_on_outlined, size: 12, color: AppColors.textMuted),
                                      const SizedBox(width: 4),
                                      Text(
                                        item.location,
                                        style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                                      ),
                                      const Spacer(),
                                      if (item.cost > 0)
                                        Text(
                                          '\$${item.cost.toInt()}',
                                          style: const TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w700,
                                            color: AppColors.oceanBlue,
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
                    },
                  ),
          ),
        ],
      ),
    );
  }

  void _showAddActivitySheet(BuildContext context, String tripId) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            top: 20,
            left: 20,
            right: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Add Activity to Day $_selectedDay',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ListTile(
                leading: const Icon(Icons.explore_rounded, color: AppColors.oceanBlue),
                title: const Text('Browse Destination Catalog'),
                subtitle: const Text('Discover top rated attractions & food tours'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  Navigator.pop(context);
                  context.push('/cities');
                },
              ),
              const SizedBox(height: 24),
            ],
          ),
        );
      },
    );
  }
}
