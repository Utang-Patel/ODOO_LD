import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../core/utils/responsive.dart';
import '../../core/widgets/empty_state.dart';
import '../../layouts/dashboard_layout.dart';
import '../../providers/trip_provider.dart';
import '../../widgets/activity_card.dart';

/// City specific activity & experience discovery screen
class ActivitySearchScreen extends ConsumerStatefulWidget {
  final String cityId;

  const ActivitySearchScreen({
    super.key,
    required this.cityId,
  });

  @override
  ConsumerState<ActivitySearchScreen> createState() => _ActivitySearchScreenState();
}

class _ActivitySearchScreenState extends ConsumerState<ActivitySearchScreen> {
  String _selectedCategory = 'All';

  static const List<String> activityCategories = [
    'All',
    'Sightseeing',
    'Culture',
    'Dining',
    'History',
    'Adventure',
    'Food & Nightlife',
  ];

  @override
  Widget build(BuildContext context) {
    final tripState = ref.watch(tripProvider);
    final city = tripState.findCityById(widget.cityId) ?? tripState.cities.first;
    final allActivities = ref.read(tripProvider.notifier).getActivitiesForCity(widget.cityId);

    final filteredActivities = _selectedCategory == 'All'
        ? allActivities
        : allActivities.where((a) => a.category.toLowerCase() == _selectedCategory.toLowerCase()).toList();

    return DashboardLayout(
      currentIndex: -1,
      showBackButton: true,
      title: '${city.name} Experiences',
      child: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // City Header Hero Banner
          SliverToBoxAdapter(
            child: Stack(
              children: [
                CachedNetworkImage(
                  imageUrl: city.imageUrl,
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
                Container(
                  height: 180,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.transparent,
                        AppColors.deepNavy.withValues(alpha: 0.85),
                      ],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                  ),
                ),
                Positioned(
                  bottom: 16,
                  left: 16,
                  right: 16,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${city.name}, ${city.country}',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: AppColors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        city.description,
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.borderLight,
                          height: 1.3,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Category Chips
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppConstants.paddingMedium,
                vertical: 12,
              ),
              child: SizedBox(
                height: 38,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  itemCount: activityCategories.length,
                  separatorBuilder: (context, index) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final cat = activityCategories[index];
                    final isSelected = _selectedCategory == cat;

                    return ChoiceChip(
                      label: Text(cat),
                      selected: isSelected,
                      onSelected: (_) => setState(() => _selectedCategory = cat),
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
            ),
          ),

          // Activities Grid
          if (filteredActivities.isEmpty)
            const SliverFillRemaining(
              child: EmptyState(
                title: 'No experiences found',
                message: 'Try exploring another category.',
                icon: Icons.local_activity_outlined,
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(
                AppConstants.paddingMedium,
                0,
                AppConstants.paddingMedium,
                32,
              ),
              sliver: SliverGrid(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: Responsive.gridCrossAxisCount(
                    context,
                    mobileCount: 1,
                    tabletCount: 2,
                    desktopCount: 3,
                  ),
                  childAspectRatio: Responsive.isMobile(context) ? 1.2 : 0.95,
                  crossAxisSpacing: 14,
                  mainAxisSpacing: 14,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final activity = filteredActivities[index];
                    return ActivityCard(
                      activity: activity,
                      onAddPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Added "${activity.name}" to your trip!'),
                            backgroundColor: AppColors.tropicalGreen,
                          ),
                        );
                      },
                    );
                  },
                  childCount: filteredActivities.length,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
