import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';

/// Card container with subtle shadow, border, and optional staggered entrance animation
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
        color: color ?? AppColors.white,
        borderRadius: BorderRadius.circular(borderRadius),
        border: border ?? Border.all(color: AppColors.border, width: 1),
        boxShadow: boxShadow ??
            [
              BoxShadow(
                color: AppColors.deepNavy.withValues(alpha: 0.04),
                blurRadius: 10,
                offset: const Offset(0, 4),
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
          duration: const Duration(milliseconds: 400),
          delay: Duration(milliseconds: animationDelayMs),
        )
        .slideY(
          begin: 0.1,
          end: 0,
          curve: Curves.easeOutCubic,
          duration: const Duration(milliseconds: 400),
          delay: Duration(milliseconds: animationDelayMs),
        );
  }
}
