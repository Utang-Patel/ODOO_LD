import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../core/constants/app_strings.dart';
import '../../core/widgets/empty_state.dart';
import '../../layouts/dashboard_layout.dart';
import '../../models/trip.dart';
import '../../providers/trip_provider.dart';
import '../../widgets/page_header.dart';
import '../../widgets/trip_card.dart';

/// My Trips screen listing active, upcoming, and past adventures
class MyTripsScreen extends ConsumerStatefulWidget {
  const MyTripsScreen({super.key});

  @override
  ConsumerState<MyTripsScreen> createState() => _MyTripsScreenState();
}

class _MyTripsScreenState extends ConsumerState<MyTripsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final tripState = ref.watch(tripProvider);

    return DashboardLayout(
      currentIndex: 1,
      showBackButton: true,
      title: 'My Journeys',
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/create-trip'),
        backgroundColor: AppColors.oceanBlue,
        foregroundColor: AppColors.white,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Plan New Trip', style: TextStyle(fontWeight: FontWeight.w600)),
      ),
      child: Column(
        children: [
          const PageHeader(
            title: 'Your Travel Timeline',
            subtitle: 'Manage customized multi-city itineraries and budgets',
          ),
          // Filter Tabs
          Container(
            margin: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
              border: Border.all(color: AppColors.border),
            ),
            child: TabBar(
              controller: _tabController,
              indicatorSize: TabBarIndicatorSize.tab,
              dividerColor: Colors.transparent,
              indicator: BoxDecoration(
                color: AppColors.oceanBlue,
                borderRadius: BorderRadius.circular(AppConstants.radiusMedium - 2),
              ),
              labelColor: AppColors.white,
              unselectedLabelColor: AppColors.textSecondary,
              labelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
              tabs: const [
                Tab(text: 'Upcoming'),
                Tab(text: 'Completed'),
                Tab(text: 'All Trips'),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildTripList(tripState.upcomingTrips),
                _buildTripList(tripState.completedTrips),
                _buildTripList(tripState.trips),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTripList(List<Trip> trips) {
    if (trips.isEmpty) {
      return EmptyState(
        title: AppStrings.noTripsTitle,
        message: AppStrings.noTripsSubtitle,
        buttonText: AppStrings.planNewTrip,
        onButtonPressed: () => context.push('/create-trip'),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(
        AppConstants.paddingMedium,
        8,
        AppConstants.paddingMedium,
        80,
      ),
      physics: const BouncingScrollPhysics(),
      itemCount: trips.length,
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final trip = trips[index];
        return TripCard(
          trip: trip,
          onTap: () => context.push('/itinerary/${trip.id}'),
          onItineraryTap: () => context.push('/itinerary/${trip.id}/view'),
        );
      },
    );
  }
}
