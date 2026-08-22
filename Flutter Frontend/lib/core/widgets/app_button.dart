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

/// Custom responsive button supporting gradients, loading states, and icon badges
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
    this.height = 50.0,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    if (variant == AppButtonVariant.gradient || variant == AppButtonVariant.sunset) {
      final gradient = variant == AppButtonVariant.gradient
          ? AppColors.primaryGradient
          : AppColors.sunsetGradient;

      return Container(
        width: width ?? double.infinity,
        height: height,
        decoration: BoxDecoration(
          gradient: onPressed == null ? null : gradient,
          color: onPressed == null ? AppColors.border : null,
          borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
          boxShadow: onPressed == null
              ? null
              : [
                  BoxShadow(
                    color: (variant == AppButtonVariant.gradient
                            ? AppColors.oceanBlue
                            : AppColors.sunsetOrange)
                        .withValues(alpha: 0.25),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
            onTap: isLoading ? null : onPressed,
            child: Center(
              child: _buildContent(context, AppColors.white),
            ),
          ),
        ),
      );
    }

    if (variant == AppButtonVariant.outline) {
      return SizedBox(
        width: width ?? double.infinity,
        height: height,
        child: OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: OutlinedButton.styleFrom(
            padding: padding ?? const EdgeInsets.symmetric(horizontal: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
            ),
          ),
          child: _buildContent(context, AppColors.oceanBlue),
        ),
      );
    }

    if (variant == AppButtonVariant.text) {
      return TextButton(
        onPressed: isLoading ? null : onPressed,
        style: TextButton.styleFrom(
          padding: padding ?? const EdgeInsets.symmetric(horizontal: 16),
        ),
        child: _buildContent(context, AppColors.oceanBlue),
      );
    }

    // Default primary or secondary
    final bgColor = variant == AppButtonVariant.secondary
        ? AppColors.cloud
        : AppColors.oceanBlue;
    final fgColor = variant == AppButtonVariant.secondary
        ? AppColors.textMain
        : AppColors.white;

    return SizedBox(
      width: width ?? double.infinity,
      height: height,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: bgColor,
          foregroundColor: fgColor,
          padding: padding ?? const EdgeInsets.symmetric(horizontal: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
            side: variant == AppButtonVariant.secondary
                ? const BorderSide(color: AppColors.border)
                : BorderSide.none,
          ),
        ),
        child: _buildContent(context, fgColor),
      ),
    );
  }

  Widget _buildContent(BuildContext context, Color textColor) {
    if (isLoading) {
      return SizedBox(
        height: 22,
        width: 22,
        child: CircularProgressIndicator(
          strokeWidth: 2.5,
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
                fontSize: 15,
                fontWeight: FontWeight.w600,
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
        fontSize: 15,
        fontWeight: FontWeight.w600,
      ),
      overflow: TextOverflow.ellipsis,
    );
  }
}
