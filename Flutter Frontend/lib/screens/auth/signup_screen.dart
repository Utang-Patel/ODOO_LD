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

/// Signup Screen for new user registration with frontend state
class SignupScreen extends ConsumerStatefulWidget {
  const SignupScreen({super.key});

  @override
  ConsumerState<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends ConsumerState<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignup() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await ref.read(authProvider.notifier).signup(
          name: _nameController.text,
          email: _emailController.text,
          password: _passwordController.text,
        );

    if (success && mounted) {
      context.go('/dashboard');
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return AuthLayout(
      title: AppStrings.startAdventure,
      subtitle: AppStrings.createAccountSubtitle,
      form: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (authState.errorMessage != null) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.danger.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.danger.withValues(alpha: 0.3)),
                ),
                child: Text(
                  authState.errorMessage!,
                  style: const TextStyle(
                    color: AppColors.danger,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],
            AppTextField(
              label: AppStrings.fullNameLabel,
              hintText: AppStrings.fullNameHint,
              controller: _nameController,
              prefixIcon: Icons.person_outline_rounded,
              validator: Validators.requiredField,
            ),
            const SizedBox(height: 14),
            AppTextField(
              label: AppStrings.emailLabel,
              hintText: AppStrings.emailHint,
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              prefixIcon: Icons.email_outlined,
              validator: Validators.email,
            ),
            const SizedBox(height: 14),
            AppTextField(
              label: AppStrings.passwordLabel,
              hintText: AppStrings.passwordHint,
              controller: _passwordController,
              isPassword: true,
              prefixIcon: Icons.lock_outline_rounded,
              validator: (v) => Validators.password(v, minLength: 6),
            ),
            const SizedBox(height: 14),
            AppTextField(
              label: AppStrings.confirmPasswordLabel,
              hintText: AppStrings.passwordHint,
              controller: _confirmPasswordController,
              isPassword: true,
              prefixIcon: Icons.lock_outline_rounded,
              validator: (v) => Validators.confirmPassword(v, _passwordController.text),
              textInputAction: TextInputAction.done,
              onSubmitted: (_) => _handleSignup(),
            ),
            const SizedBox(height: 24),
            AppButton(
              text: AppStrings.signupButton,
              onPressed: _handleSignup,
              variant: AppButtonVariant.gradient,
              isLoading: authState.isLoading,
              icon: Icons.flight_takeoff_rounded,
            ),
          ],
        ),
      ),
      bottomAction: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            AppStrings.alreadyHaveAccount,
            style: TextStyle(
              color: AppColors.borderLight,
              fontSize: 14,
            ),
          ),
          const SizedBox(width: 6),
          GestureDetector(
            onTap: () => context.go('/login'),
            child: const Text(
              'Sign In',
              style: TextStyle(
                color: AppColors.aqua,
                fontWeight: FontWeight.w700,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
