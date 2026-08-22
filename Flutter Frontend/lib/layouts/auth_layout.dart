import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';
import '../core/constants/app_strings.dart';
import '../core/utils/responsive.dart';

/// Responsive authentication scaffold supporting cyber gradient branding & dark glassmorphic form container
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
      backgroundColor: AppColors.bgPrimary,
      body: Stack(
        children: [
          // Deep Space Background
          Container(
            color: AppColors.bgPrimary,
          ),

          // Ambient Glowing Gradient Blobs
          Positioned(
            top: -100,
            right: -80,
            child: Container(
              width: 320,
              height: 320,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.primary.withValues(alpha: 0.22),
              ),
            ).animate().scale(delay: const Duration(milliseconds: 200), duration: const Duration(milliseconds: 800)),
          ),

          Positioned(
            bottom: -80,
            left: -60,
            child: Container(
              width: 280,
              height: 280,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.secondary.withValues(alpha: 0.18),
              ),
            ).animate().scale(delay: const Duration(milliseconds: 400), duration: const Duration(milliseconds: 800)),
          ),

          Positioned(
            top: 200,
            left: -100,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.supporting.withValues(alpha: 0.12),
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
                      color: AppColors.textSecondary,
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
          width: 72,
          height: 72,
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.5),
                blurRadius: 24,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Image.asset(
            'assets/images/logo.png',
            fit: BoxFit.contain,
          ),
        ).animate().scale(duration: const Duration(milliseconds: 500), curve: Curves.elasticOut),
        const SizedBox(height: 14),
        RichText(
          text: const TextSpan(
            children: [
              TextSpan(
                text: 'Globe',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppColors.white,
                  letterSpacing: -0.5,
                ),
              ),
              TextSpan(
                text: 'Trotter',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: AppColors.secondary,
                  letterSpacing: -0.5,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 4),
        const Text(
          AppStrings.appTagline,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.supporting,
            letterSpacing: 0.2,
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
        color: AppColors.surface.withValues(alpha: 0.85),
        borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
        border: Border.all(color: AppColors.borderGlass, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.5),
            blurRadius: 36,
            offset: const Offset(0, 12),
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
              fontWeight: FontWeight.w800,
              color: AppColors.textMain,
              letterSpacing: -0.4,
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
