import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../core/utils/responsive.dart';
import '../../core/widgets/app_text_field.dart';
import '../../core/widgets/empty_state.dart';
import '../../layouts/dashboard_layout.dart';
import '../../providers/trip_provider.dart';
import '../../widgets/destination_card.dart';
import '../../widgets/page_header.dart';

/// City & Destination search exploration screen
class CitySearchScreen extends ConsumerWidget {
  const CitySearchScreen({super.key});

  static const List<String> categories = [
    'All',
    'Romantic',
    'Scenic',
    'Historical',
    'Metropolis',
    'Tropical',
    'Luxury',
    'Island',
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tripState = ref.watch(tripProvider);
    final filteredCities = tripState.filteredCities;

    return DashboardLayout(
      currentIndex: 2,
      title: 'Explore Destinations',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search & Filter Header
          Padding(
            padding: const EdgeInsets.fromLTRB(
              AppConstants.paddingMedium,
              AppConstants.paddingMedium,
              AppConstants.paddingMedium,
              0,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const PageHeader(
                  title: 'Discover the World 🌎',
                  subtitle: 'Search iconic cities and curated bucket list getaways',
                ),
                const SizedBox(height: 8),
                AppTextField(
                  hintText: 'Search city, country, or keyword...',
                  prefixIcon: Icons.search_rounded,
                  onChanged: (val) => ref.read(tripProvider.notifier).updateSearchQuery(val),
                ),
                const SizedBox(height: 12),
                // Category Chips
                SizedBox(
                  height: 38,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    physics: const BouncingScrollPhysics(),
                    itemCount: categories.length,
                    separatorBuilder: (context, index) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      final cat = categories[index];
                      final isSelected = tripState.selectedCategory == cat;

                      return ChoiceChip(
                        label: Text(cat),
                        selected: isSelected,
                        onSelected: (_) => ref.read(tripProvider.notifier).updateCategory(cat),
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
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Destination Grid
          Expanded(
            child: filteredCities.isEmpty
                ? const EmptyState(
                    title: 'No destinations match your search',
                    message: 'Try changing your keyword or category filter.',
                    icon: Icons.search_off_rounded,
                  )
                : LayoutBuilder(
                    builder: (context, constraints) {
                      final crossAxisCount = Responsive.gridCrossAxisCount(
                        context,
                        mobileCount: 2,
                        tabletCount: 3,
                        desktopCount: 4,
                      );

                      return GridView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: AppConstants.paddingMedium),
                        physics: const BouncingScrollPhysics(),
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: crossAxisCount,
                          childAspectRatio: 0.72,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                        ),
                        itemCount: filteredCities.length,
                        itemBuilder: (context, index) {
                          final city = filteredCities[index];
                          return DestinationCard(
                            city: city,
                            onTap: () => context.push('/activities/${city.id}'),
                          );
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
