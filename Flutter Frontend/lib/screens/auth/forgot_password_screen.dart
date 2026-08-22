import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/utils/validators.dart';
import '../../core/widgets/app_button.dart';
import '../../core/widgets/app_text_field.dart';
import '../../layouts/auth_layout.dart';
import '../../providers/auth_provider.dart';

/// Password recovery screen simulating reset email dispatch
class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  bool _emailSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _handleReset() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await ref.read(authProvider.notifier).resetPassword(_emailController.text);
    if (success && mounted) {
      setState(() {
        _emailSent = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return AuthLayout(
      title: AppStrings.forgotPasswordTitle,
      subtitle: AppStrings.forgotPasswordSubtitle,
      form: _emailSent
          ? Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.tropicalGreen.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.tropicalGreen.withValues(alpha: 0.3)),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.mark_email_read_rounded, size: 40, color: AppColors.tropicalGreen),
                      const SizedBox(height: 10),
                      const Text(
                        'Reset Link Dispatched!',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textMain,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'We sent password recovery instructions to ${_emailController.text}. Please check your inbox.',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                AppButton(
                  text: AppStrings.backToLogin,
                  onPressed: () => context.go('/login'),
                  variant: AppButtonVariant.outline,
                ),
              ],
            )
          : Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  AppTextField(
                    label: AppStrings.emailLabel,
                    hintText: AppStrings.emailHint,
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    prefixIcon: Icons.email_outlined,
                    validator: Validators.email,
                    textInputAction: TextInputAction.done,
                    onSubmitted: (_) => _handleReset(),
                  ),
                  const SizedBox(height: 24),
                  AppButton(
                    text: AppStrings.sendResetLink,
                    onPressed: _handleReset,
                    variant: AppButtonVariant.gradient,
                    isLoading: authState.isLoading,
                    icon: Icons.send_rounded,
                  ),
                  const SizedBox(height: 16),
                  AppButton(
                    text: AppStrings.backToLogin,
                    onPressed: () => context.go('/login'),
                    variant: AppButtonVariant.text,
                  ),
                ],
              ),
            ),
    );
  }
}
