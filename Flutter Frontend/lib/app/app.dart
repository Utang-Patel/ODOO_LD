import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/constants/app_strings.dart';
import '../screens/splash_screen.dart';
import 'router.dart';
import 'theme.dart';

/// Root application widget configuring Theme and GoRouter
class GlobeTrotterApp extends ConsumerStatefulWidget {
  const GlobeTrotterApp({super.key});

  @override
  ConsumerState<GlobeTrotterApp> createState() => _GlobeTrotterAppState();
}

class _GlobeTrotterAppState extends ConsumerState<GlobeTrotterApp> {
  bool _showSplash = true;

  void _onSplashDone() {
    if (mounted) {
      setState(() => _showSplash = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final router = ref.watch(routerProvider);

    if (_showSplash) {
      return MaterialApp(
        title: AppStrings.appName,
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: SplashScreen(onDone: _onSplashDone),
      );
    }

    return MaterialApp.router(
      title: AppStrings.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: router,
    );
  }
}
