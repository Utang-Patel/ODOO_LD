import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';
import '../core/constants/app_strings.dart';
import '../core/utils/responsive.dart';

/// Responsive authentication scaffold supporting gradient branding & adaptive form container
class AuthLayout extends StatelessWidget {
  final String title;
  final String subtitle;
  final Widget form;
  final Widget? bottomAction;

  const AuthLayout({
    super.key,
    required this.title,
    required this.subtitle,
    required this.form,
    this.bottomAction,
  });

  @override
  Widget build(BuildContext context) {
    final isTablet = Responsive.isTablet(context) || Responsive.isDesktop(context);

    return Scaffold(
      backgroundColor: AppColors.deepNavy,
      body: Stack(
        children: [
          // Aurora Gradient Background
          Container(
            decoration: const BoxDecoration(
              gradient: AppColors.auroraGradient,
            ),
          ),

          // Decorative Flight Path Curved Vectors & Glow
          Positioned(
            top: -60,
            right: -60,
            child: Container(
              width: 240,
              height: 240,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.aqua.withValues(alpha: 0.15),
              ),
            ),
          ),

          Positioned(
            bottom: -40,
            left: -40,
            child: Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.sunsetOrange.withValues(alpha: 0.12),
              ),
            ),
          ),

          // Content Area
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(AppConstants.paddingLarge),
                child: isTablet ? _buildTabletLayout(context) : _buildMobileLayout(context),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMobileLayout(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // App Logo & Branding
        _buildBrandHeader(),
        const SizedBox(height: 24),
        // Auth Card Container
        _buildFormCard(context),
        if (bottomAction != null) ...[
          const SizedBox(height: 20),
          bottomAction!,
        ],
      ],
    );
  }

  Widget _buildTabletLayout(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 860),
      child: Row(
        children: [
          // Left Branding Column
          Expanded(
            flex: 5,
            child: Padding(
              padding: const EdgeInsets.all(AppConstants.paddingLarge),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildBrandHeader(isLeftAligned: true),
                  const SizedBox(height: 24),
                  const Text(
                    'Create customized multi-city itineraries, discover hidden gems, visualize flights, and manage travel budgets effortlessly.',
                    style: TextStyle(
                      color: AppColors.cloud,
                      fontSize: 15,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Right Form Column
          Expanded(
            flex: 6,
            child: Column(
              children: [
                _buildFormCard(context),
                if (bottomAction != null) ...[
                  const SizedBox(height: 20),
                  bottomAction!,
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBrandHeader({bool isLeftAligned = false}) {
    return Column(
      crossAxisAlignment: isLeftAligned ? CrossAxisAlignment.start : CrossAxisAlignment.center,
      children: [
        Container(
          width: 80,
          height: 80,
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: AppColors.aqua.withValues(alpha: 0.35),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Image.asset(
            'assets/images/logo.png',
            fit: BoxFit.contain,
          ),
        ).animate().scale(duration: const Duration(milliseconds: 500)),
        const SizedBox(height: 12),
        const Text(
          AppStrings.appName,
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w800,
            color: AppColors.white,
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 4),
        const Text(
          AppStrings.appTagline,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: AppColors.aqua,
          ),
        ),
      ],
    );
  }

  Widget _buildFormCard(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 440),
      padding: const EdgeInsets.all(AppConstants.paddingLarge),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
        boxShadow: [
          BoxShadow(
            color: AppColors.deepNavy.withValues(alpha: 0.25),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.textMain,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            subtitle,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 24),
          form,
        ],
      ),
    ).animate().fadeIn(duration: const Duration(milliseconds: 400)).slideY(begin: 0.05, end: 0);
  }
}
