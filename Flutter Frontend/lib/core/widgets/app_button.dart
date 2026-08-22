import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_constants.dart';

enum AppButtonVariant {
  primary,
  secondary,
  gradient,
  sunset,
  outline,
  text,
}

/// Custom responsive button supporting SaaS gradients, glowing shadows, loading states, and icon badges
class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final bool isLoading;
  final IconData? icon;
  final double? width;
  final double height;
  final EdgeInsetsGeometry? padding;

  const AppButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.isLoading = false,
    this.icon,
    this.width,
    this.height = 48.0,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    if (variant == AppButtonVariant.gradient || variant == AppButtonVariant.primary || variant == AppButtonVariant.sunset) {
      final gradient = variant == AppButtonVariant.sunset
          ? AppColors.sunsetGradient
          : AppColors.saasGradient;

      return Container(
        width: width ?? double.infinity,
        height: height,
        decoration: BoxDecoration(
          gradient: onPressed == null ? null : gradient,
          color: onPressed == null ? AppColors.surfaceHover : null,
          borderRadius: BorderRadius.circular(AppConstants.radiusSmall + 4),
          boxShadow: onPressed == null
              ? null
              : [
                  BoxShadow(
                    color: AppColors.primary.withValues(alpha: 0.4),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(AppConstants.radiusSmall + 4),
            onTap: isLoading ? null : onPressed,
            child: Center(
              child: _buildContent(context, AppColors.white),
            ),
          ),
        ),
      );
    }

    if (variant == AppButtonVariant.outline) {
      return Container(
        width: width ?? double.infinity,
        height: height,
        decoration: BoxDecoration(
          color: const Color(0x1A7C3AED),
          borderRadius: BorderRadius.circular(AppConstants.radiusSmall + 4),
          border: Border.all(color: const Color(0x597C3AED), width: 1.2),
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(AppConstants.radiusSmall + 4),
            onTap: isLoading ? null : onPressed,
            child: Center(
              child: _buildContent(context, AppColors.white),
            ),
          ),
        ),
      );
    }

    if (variant == AppButtonVariant.text) {
      return TextButton(
        onPressed: isLoading ? null : onPressed,
        style: TextButton.styleFrom(
          padding: padding ?? const EdgeInsets.symmetric(horizontal: 16),
        ),
        child: _buildContent(context, AppColors.supporting),
      );
    }

    // Default secondary (Dark Glass)
    return Container(
      width: width ?? double.infinity,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppConstants.radiusSmall + 4),
        border: Border.all(color: AppColors.borderGlass),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(AppConstants.radiusSmall + 4),
          onTap: isLoading ? null : onPressed,
          child: Center(
            child: _buildContent(context, AppColors.textMain),
          ),
        ),
      ),
    );
  }

  Widget _buildContent(BuildContext context, Color textColor) {
    if (isLoading) {
      return SizedBox(
        height: 20,
        width: 20,
        child: CircularProgressIndicator(
          strokeWidth: 2.2,
          valueColor: AlwaysStoppedAnimation<Color>(textColor),
        ),
      );
    }

    if (icon != null) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 18, color: textColor),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              text,
              style: TextStyle(
                color: textColor,
                fontSize: 14,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.2,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      );
    }

    return Text(
      text,
      style: TextStyle(
        color: textColor,
        fontSize: 14,
        fontWeight: FontWeight.w700,
        letterSpacing: 0.2,
      ),
      overflow: TextOverflow.ellipsis,
    );
  }
}
