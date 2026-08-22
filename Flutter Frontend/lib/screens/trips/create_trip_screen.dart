import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_constants.dart';
import '../../core/utils/validators.dart';
import '../../core/widgets/app_button.dart';
import '../../core/widgets/app_text_field.dart';
import '../../layouts/dashboard_layout.dart';
import '../../models/city.dart';
import '../../models/trip.dart';
import '../../models/trip_stop.dart';
import '../../providers/trip_provider.dart';
import '../../widgets/page_header.dart';

/// Interactive trip planning wizard to design multi-city journeys
class CreateTripScreen extends ConsumerStatefulWidget {
  const CreateTripScreen({super.key});

  @override
  ConsumerState<CreateTripScreen> createState() => _CreateTripScreenState();
}

class _CreateTripScreenState extends ConsumerState<CreateTripScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _budgetController = TextEditingController(text: '2500');
  final _descriptionController = TextEditingController();

  final List<City> _selectedCities = [];
  int _travelers = 2;
  bool _isCreating = false;

  @override
  void dispose() {
    _titleController.dispose();
    _budgetController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _handleCreateTrip() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCities.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select at least one destination city stop.'),
          backgroundColor: AppColors.sunsetOrange,
        ),
      );
      return;
    }

    setState(() => _isCreating = true);
    await Future.delayed(const Duration(milliseconds: 600));

    final tripId = 'trip-${DateTime.now().millisecondsSinceEpoch}';
    final now = DateTime.now();

    final stops = _selectedCities.asMap().entries.map((entry) {
      final idx = entry.key;
      final city = entry.value;
      return TripStop(
        id: 'stop-$idx',
        city: city,
        arrivalDate: now.add(Duration(days: idx * 4)),
        departureDate: now.add(Duration(days: (idx + 1) * 4)),
        budget: (double.tryParse(_budgetController.text) ?? 2500) / _selectedCities.length,
      );
    }).toList();

    final newTrip = Trip(
      id: tripId,
      title: _titleController.text.trim(),
      description: _descriptionController.text.trim().isNotEmpty
          ? _descriptionController.text.trim()
          : 'A memorable multi-city adventure with ${_selectedCities.length} stops.',
      coverImageUrl: _selectedCities.first.imageUrl,
      startDate: now.add(const Duration(days: 7)),
      endDate: now.add(Duration(days: 7 + (_selectedCities.length * 4))),
      budget: double.tryParse(_budgetController.text) ?? 2500.0,
      spent: 0.0,
      stops: stops,
      travelersCount: _travelers,
    );

    ref.read(tripProvider.notifier).addTrip(newTrip);
    ref.read(tripProvider.notifier).selectTrip(tripId);

    if (mounted) {
      setState(() => _isCreating = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Trip created successfully! Customizing itinerary... ✈️'),
          backgroundColor: AppColors.tropicalGreen,
        ),
      );
      context.go('/itinerary/$tripId');
    }
  }

  @override
  Widget build(BuildContext context) {
    final tripState = ref.watch(tripProvider);

    return DashboardLayout(
      currentIndex: -1,
      showBackButton: true,
      title: 'Plan New Adventure',
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(AppConstants.paddingMedium),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const PageHeader(
                title: 'Create Your Journey',
                subtitle: 'Assemble destinations, dates, travelers, and spending budgets',
              ),
              const SizedBox(height: 12),

              // Trip Name
              AppTextField(
                label: 'Trip Title',
                hintText: 'e.g. Mediterranean Coastal Explorer 2026',
                controller: _titleController,
                prefixIcon: Icons.flight_takeoff_rounded,
                validator: Validators.requiredField,
              ),

              const SizedBox(height: 16),

              // Budget & Travelers Row
              Row(
                children: [
                  Expanded(
                    child: AppTextField(
                      label: 'Total Budget (USD)',
                      hintText: '2500',
                      controller: _budgetController,
                      keyboardType: TextInputType.number,
                      prefixIcon: Icons.attach_money_rounded,
                      validator: Validators.number,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Travelers',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textMain,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          height: 52,
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: AppColors.white,
                            borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              InkWell(
                                onTap: _travelers > 1 ? () => setState(() => _travelers--) : null,
                                child: const Icon(Icons.remove_circle_outline, size: 20, color: AppColors.oceanBlue),
                              ),
                              Text(
                                '$_travelers ${_travelers == 1 ? 'Person' : 'People'}',
                                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                              ),
                              InkWell(
                                onTap: () => setState(() => _travelers++),
                                child: const Icon(Icons.add_circle_outline, size: 20, color: AppColors.oceanBlue),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // Destination Stops Selection
              const Text(
                'Select Destination Stops',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textMain,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Tap cities to add or remove them from this multi-city itinerary',
                style: TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
              const SizedBox(height: 10),

              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: tripState.cities.map((city) {
                  final isSelected = _selectedCities.any((c) => c.id == city.id);
                  return FilterChip(
                    label: Text('${city.name}, ${city.country}'),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() {
                        if (selected) {
                          _selectedCities.add(city);
                        } else {
                          _selectedCities.removeWhere((c) => c.id == city.id);
                        }
                      });
                    },
                    selectedColor: AppColors.oceanBlue,
                    checkmarkColor: AppColors.white,
                    labelStyle: TextStyle(
                      color: isSelected ? AppColors.white : AppColors.textMain,
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  );
                }).toList(),
              ),

              if (_selectedCities.isNotEmpty) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.oceanBlue.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
                    border: Border.all(color: AppColors.oceanBlue.withValues(alpha: 0.2)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.route_rounded, color: AppColors.oceanBlue, size: 20),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'Route: ${_selectedCities.map((c) => c.name).join(' ➔ ')}',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.deepNavy,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 20),

              // Description Note
              AppTextField(
                label: 'Trip Notes / Highlights (Optional)',
                hintText: 'e.g. Focus on cultural heritage, photography, and local culinary experiences.',
                controller: _descriptionController,
                maxLines: 3,
              ),

              const SizedBox(height: 32),

              // Create CTA
              AppButton(
                text: 'Build Itinerary & Save Trip',
                onPressed: _handleCreateTrip,
                variant: AppButtonVariant.gradient,
                isLoading: _isCreating,
                icon: Icons.check_circle_outline_rounded,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
