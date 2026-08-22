import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';

/// Glassmorphic Dark Card container matching React's .gt-glass-card utility
class AnimatedCard extends StatelessWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? color;
  final double? width;
  final double? height;
  final double borderRadius;
  final Border? border;
  final List<BoxShadow>? boxShadow;
  final int animationDelayMs;
  final bool animate;

  const AnimatedCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding,
    this.margin,
    this.color,
    this.width,
    this.height,
    this.borderRadius = AppConstants.radiusMedium,
    this.border,
    this.boxShadow,
    this.animationDelayMs = 0,
    this.animate = true,
  });

  @override
  Widget build(BuildContext context) {
    final cardWidget = Container(
      width: width,
      height: height,
      margin: margin,
      decoration: BoxDecoration(
        color: color ?? AppColors.surface,
        borderRadius: BorderRadius.circular(borderRadius),
        border: border ?? Border.all(color: AppColors.borderGlass, width: 1),
        boxShadow: boxShadow ??
            [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.35),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(borderRadius),
          onTap: onTap,
          child: Padding(
            padding: padding ?? const EdgeInsets.all(AppConstants.paddingMedium),
            child: child,
          ),
        ),
      ),
    );

    if (!animate || MediaQuery.of(context).disableAnimations) {
      return cardWidget;
    }

    return cardWidget
        .animate()
        .fadeIn(
          duration: const Duration(milliseconds: 350),
          delay: Duration(milliseconds: animationDelayMs),
        )
        .slideY(
          begin: 0.08,
          end: 0,
          curve: Curves.easeOutCubic,
          duration: const Duration(milliseconds: 350),
          delay: Duration(milliseconds: animationDelayMs),
        );
  }
}
