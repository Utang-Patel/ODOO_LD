import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../layouts/dashboard_layout.dart';
import '../../providers/trip_provider.dart';
import '../../widgets/animated_card.dart';
import '../../widgets/page_header.dart';

/// Calendar & Timeline view using TableCalendar for trip day visualization
class CalendarScreen extends ConsumerStatefulWidget {
  final String tripId;

  const CalendarScreen({
    super.key,
    required this.tripId,
  });

  @override
  ConsumerState<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends ConsumerState<CalendarScreen> {
  late DateTime _focusedDay;
  DateTime? _selectedDay;

  @override
  void initState() {
    super.initState();
    _focusedDay = DateTime.now().add(const Duration(days: 14));
    _selectedDay = _focusedDay;
  }

  @override
  Widget build(BuildContext context) {
    final tripState = ref.watch(tripProvider);
    final trip = tripState.findTripById(widget.tripId) ?? tripState.currentTrip;

    if (trip == null) {
      return DashboardLayout(
        currentIndex: 3,
        showBackButton: true,
        title: 'Trip Calendar',
        child: const Center(child: Text('No active trip found.')),
      );
    }

    final dayEvents = trip.itineraryItems;
    final selectedDayFormatted = DateFormat('EEEE, MMMM d').format(_selectedDay ?? _focusedDay);

    return DashboardLayout(
      currentIndex: 3,
      showBackButton: true,
      title: 'Trip Calendar & Timeline',
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.only(bottom: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            PageHeader(
              title: trip.title,
              subtitle: 'Daily schedule, flight dates, and activity timeline',
            ),

            // TableCalendar Card Container
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: AnimatedCard(
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
                child: TableCalendar(
                  firstDay: DateTime.utc(2025, 1, 1),
                  lastDay: DateTime.utc(2028, 12, 31),
                  focusedDay: _focusedDay,
                  selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
                  onDaySelected: (selectedDay, focusedDay) {
                    setState(() {
                      _selectedDay = selectedDay;
                      _focusedDay = focusedDay;
                    });
                  },
                  calendarStyle: CalendarStyle(
                    defaultTextStyle: const TextStyle(color: AppColors.textMain, fontWeight: FontWeight.w600),
                    weekendTextStyle: const TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w600),
                    outsideTextStyle: const TextStyle(color: AppColors.textMuted),
                    todayDecoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.35),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.primary),
                    ),
                    selectedDecoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                    selectedTextStyle: const TextStyle(color: AppColors.white, fontWeight: FontWeight.w800),
                    markerDecoration: const BoxDecoration(
                      color: AppColors.secondary,
                      shape: BoxShape.circle,
                    ),
                  ),
                  headerStyle: const HeaderStyle(
                    formatButtonVisible: false,
                    titleCentered: true,
                    leftChevronIcon: Icon(Icons.chevron_left, color: AppColors.textMain),
                    rightChevronIcon: Icon(Icons.chevron_right, color: AppColors.textMain),
                    titleTextStyle: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textMain,
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Scheduled Events on selected day
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    selectedDayFormatted,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textMain,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.oceanBlue.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                    ),
                    child: Text(
                      '${dayEvents.length} items',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppColors.oceanBlue,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 10),

            if (dayEvents.isEmpty)
              const Padding(
                padding: EdgeInsets.all(AppConstants.paddingLarge),
                child: Center(
                  child: Text(
                    'No activities scheduled for this date.',
                    style: TextStyle(color: AppColors.textMuted),
                  ),
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
                itemCount: dayEvents.length,
                separatorBuilder: (context, index) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final item = dayEvents[index];
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
                              if (item.location.isNotEmpty) ...[
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.location_on_outlined, size: 12, color: AppColors.textMuted),
                                    const SizedBox(width: 4),
                                    Text(
                                      item.location,
                                      style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                                    ),
                                  ],
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
