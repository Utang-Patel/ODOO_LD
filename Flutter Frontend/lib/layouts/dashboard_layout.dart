import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';
import '../core/constants/app_strings.dart';
import '../providers/auth_provider.dart';
import '../widgets/app_drawer.dart';
import '../widgets/mobile_bottom_nav.dart';

/// Main Dashboard Scaffold with unified AppBar, Mobile Bottom Navigation, and Drawer
class DashboardLayout extends ConsumerWidget {
  final Widget child;
  final int currentIndex;
  final String? title;
  final bool showBackButton;
  final List<Widget>? actions;
  final Widget? floatingActionButton;

  const DashboardLayout({
    super.key,
    required this.child,
    this.currentIndex = 0,
    this.title,
    this.showBackButton = false,
    this.actions,
    this.floatingActionButton,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: AppColors.cloud,
      drawer: const AppDrawer(),
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        leading: showBackButton
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: AppColors.textMain),
                onPressed: () {
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go('/dashboard');
                  }
                },
              )
            : Builder(
                builder: (context) => IconButton(
                  icon: const Icon(Icons.menu_rounded, color: AppColors.textMain),
                  onPressed: () => Scaffold.of(context).openDrawer(),
                ),
              ),
        title: title != null
            ? Text(
                title!,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textMain,
                ),
              )
            : Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
                    ),
                    child: const Icon(
                      Icons.flight_takeoff_rounded,
                      size: 16,
                      color: AppColors.white,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    AppStrings.appName,
                    style: TextStyle(
                      fontSize: 19,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textMain,
                      letterSpacing: -0.3,
                    ),
                  ),
                ],
              ),
        actions: actions ??
            [
              IconButton(
                icon: const Icon(Icons.notifications_none_rounded, color: AppColors.textMain),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('No new notifications. Safe travels! ✈️'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                },
              ),
              Padding(
                padding: const EdgeInsets.only(right: 12.0),
                child: GestureDetector(
                  onTap: () => context.go('/profile'),
                  child: CircleAvatar(
                    radius: 16,
                    backgroundColor: AppColors.oceanBlue,
                    child: Text(
                      user?.name.isNotEmpty == true ? user!.name[0].toUpperCase() : 'A',
                      style: const TextStyle(
                        color: AppColors.white,
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ),
            ],
      ),
      body: SafeArea(
        child: child,
      ),
      bottomNavigationBar: currentIndex >= 0
          ? MobileBottomNav(currentIndex: currentIndex)
          : null,
      floatingActionButton: floatingActionButton,
    );
  }
}
