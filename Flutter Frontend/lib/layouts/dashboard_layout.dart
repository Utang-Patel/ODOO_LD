import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_strings.dart';
import '../providers/auth_provider.dart';
import '../widgets/app_drawer.dart';

/// Main Dashboard Scaffold with unified Dark Cyber Glass AppBar, Navigation, and Drawer
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
      backgroundColor: AppColors.bgPrimary,
      drawer: showBackButton ? null : const AppDrawer(),
      appBar: AppBar(
        backgroundColor: AppColors.bgPrimary,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: showBackButton
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 19, color: AppColors.textMain),
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
                  fontWeight: FontWeight.w800,
                  color: AppColors.textMain,
                  letterSpacing: -0.3,
                ),
              )
            : Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withValues(alpha: 0.4),
                          blurRadius: 10,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(3),
                    child: Image.asset(
                      'assets/images/logo.png',
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(width: 10),
                  RichText(
                    text: const TextSpan(
                      children: [
                        TextSpan(
                          text: 'Globe',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 19,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.5,
                          ),
                        ),
                        TextSpan(
                          text: 'Trotter',
                          style: TextStyle(
                            color: AppColors.secondary,
                            fontSize: 19,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
        actions: actions ??
            [
              IconButton(
                icon: const Icon(Icons.notifications_none_rounded, color: AppColors.textSecondary, size: 22),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('No new notifications. Safe travels! ✈️'),
                      backgroundColor: AppColors.surface,
                      duration: Duration(seconds: 2),
                    ),
                  );
                },
              ),
              Padding(
                padding: const EdgeInsets.only(right: 14.0),
                child: GestureDetector(
                  onTap: () => context.go('/profile'),
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: AppColors.saasGradient,
                    ),
                    child: CircleAvatar(
                      radius: 15,
                      backgroundColor: AppColors.bgSecondary,
                      child: Text(
                        user?.name.isNotEmpty == true ? user!.name[0].toUpperCase() : 'A',
                        style: const TextStyle(
                          color: AppColors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                        ),
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
      bottomNavigationBar: null,
      floatingActionButton: floatingActionButton,
    );
  }
}
