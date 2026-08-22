import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_constants.dart';

/// Interactive Globe Widget with atmospheric glow, latitude/longitude rings,
/// destination pins, and rotation dynamics.
class GlobeWidget extends StatefulWidget {
  final double size;
  final VoidCallback? onExploreTap;

  const GlobeWidget({
    super.key,
    this.size = 280.0,
    this.onExploreTap,
  });

  @override
  State<GlobeWidget> createState() => _GlobeWidgetState();
}

class _GlobeWidgetState extends State<GlobeWidget> with SingleTickerProviderStateMixin {
  late AnimationController _rotationController;
  double _manualRotation = 0.0;

  @override
  void initState() {
    super.initState();
    _rotationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 24),
    )..repeat();
  }

  @override
  void dispose() {
    _rotationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onHorizontalDragUpdate: (details) {
        setState(() {
          _manualRotation += details.primaryDelta! * 0.01;
        });
      },
      child: Center(
        child: SizedBox(
          width: widget.size,
          height: widget.size,
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Atmospheric Glow Outer Rings
              Container(
                width: widget.size * 0.95,
                height: widget.size * 0.95,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      AppColors.oceanBlue.withValues(alpha: 0.25),
                      AppColors.aqua.withValues(alpha: 0.12),
                      Colors.transparent,
                    ],
                    stops: const [0.6, 0.85, 1.0],
                  ),
                ),
              ),

              // Animated Globe Painter
              AnimatedBuilder(
                animation: _rotationController,
                builder: (context, child) {
                  final angle = (_rotationController.value * 2 * math.pi) + _manualRotation;
                  return CustomPaint(
                    size: Size(widget.size * 0.82, widget.size * 0.82),
                    painter: _GlobePainter(rotationAngle: angle),
                  );
                },
              ),

              // Glassmorphism Center Ring
              Container(
                width: widget.size * 0.82,
                height: widget.size * 0.82,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppColors.aqua.withValues(alpha: 0.4),
                    width: 1.5,
                  ),
                ),
              ),

              // Interactive Floating Badge
              Positioned(
                bottom: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.deepNavy.withValues(alpha: 0.85),
                    borderRadius: BorderRadius.circular(AppConstants.radiusFull),
                    border: Border.all(color: AppColors.aqua.withValues(alpha: 0.4)),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.deepNavy.withValues(alpha: 0.3),
                        blurRadius: 10,
                      ),
                    ],
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.touch_app_rounded, size: 14, color: AppColors.aqua),
                      SizedBox(width: 6),
                      Text(
                        'Drag to rotate globe',
                        style: TextStyle(
                          color: AppColors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _GlobePainter extends CustomPainter {
  final double rotationAngle;

  _GlobePainter({required this.rotationAngle});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // 1. Draw Globe Sphere with Ocean Gradient
    final spherePaint = Paint()
      ..shader = const RadialGradient(
        center: Alignment(-0.3, -0.3),
        colors: [
          Color(0xFF0F3960),
          Color(0xFF071A2B),
          Color(0xFF040E18),
        ],
        stops: [0.0, 0.7, 1.0],
      ).createShader(Rect.fromCircle(center: center, radius: radius));

    canvas.drawCircle(center, radius, spherePaint);

    // 2. Latitude Rings
    final linePaint = Paint()
      ..color = AppColors.oceanBlue.withValues(alpha: 0.28)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    for (int i = 1; i <= 3; i++) {
      final yOffset = radius * (i * 0.25);
      final rx = math.sqrt(radius * radius - yOffset * yOffset);
      canvas.drawOval(
        Rect.fromCenter(center: Offset(center.dx, center.dy - yOffset), width: rx * 2, height: 16),
        linePaint,
      );
      canvas.drawOval(
        Rect.fromCenter(center: Offset(center.dx, center.dy + yOffset), width: rx * 2, height: 16),
        linePaint,
      );
    }

    // Equator
    canvas.drawOval(
      Rect.fromCenter(center: center, width: radius * 2, height: 20),
      linePaint..color = AppColors.aqua.withValues(alpha: 0.35),
    );

    // 3. Rotating Longitude Meridians
    final meridianPaint = Paint()
      ..color = AppColors.oceanBlue.withValues(alpha: 0.25)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    for (int i = 0; i < 6; i++) {
      final angle = rotationAngle + (i * math.pi / 3);
      final xRadius = radius * math.cos(angle).abs();
      if (xRadius > 2) {
        canvas.drawOval(
          Rect.fromCenter(center: center, width: xRadius * 2, height: radius * 2),
          meridianPaint,
        );
      }
    }

    // 4. Continents & Travel Destination Pins
    final pinPaint = Paint()
      ..color = AppColors.aqua
      ..style = PaintingStyle.fill;

    final orangePinPaint = Paint()
      ..color = AppColors.sunsetOrange
      ..style = PaintingStyle.fill;

    final List<Map<String, double>> pinCoordinates = [
      {'lat': 0.35, 'lon': 0.1},   // Paris / Europe
      {'lat': -0.15, 'lon': 1.8},  // Bali / Asia
      {'lat': 0.45, 'lon': 2.2},   // Tokyo / East Asia
      {'lat': 0.28, 'lon': 4.2},   // New York / Americas
      {'lat': 0.22, 'lon': 1.0},   // Dubai / Middle East
    ];

    for (int i = 0; i < pinCoordinates.length; i++) {
      final coord = pinCoordinates[i];
      final lon = coord['lon']! + rotationAngle;
      final lat = coord['lat']!;

      // Project onto sphere
      final xOffset = radius * math.cos(lat) * math.sin(lon);
      final z = math.cos(lon);

      if (z > -0.1) {
        // Visible on front hemisphere
        final yOffset = -radius * math.sin(lat);
        final pinPos = Offset(center.dx + xOffset, center.dy + yOffset);
        final opacity = ((z + 0.1) / 1.1).clamp(0.2, 1.0);

        final p = (i % 2 == 0 ? pinPaint : orangePinPaint)
          ..color = (i % 2 == 0 ? AppColors.aqua : AppColors.sunsetOrange).withValues(alpha: opacity);

        // Pulse ring
        canvas.drawCircle(
          pinPos,
          7 * opacity,
          Paint()
            ..color = p.color.withValues(alpha: 0.3 * opacity)
            ..style = PaintingStyle.stroke
            ..strokeWidth = 1.5,
        );

        // Solid Pin Center
        canvas.drawCircle(pinPos, 3.5 * opacity, p);
      }
    }

    // 5. Atmosphere Crescent Rim Lighting
    final rimPaint = Paint()
      ..shader = RadialGradient(
        center: const Alignment(-0.8, -0.8),
        colors: [
          AppColors.aqua.withValues(alpha: 0.5),
          Colors.transparent,
        ],
        stops: const [0.85, 1.0],
      ).createShader(Rect.fromCircle(center: center, radius: radius))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0;

    canvas.drawCircle(center, radius - 1.5, rimPaint);
  }

  @override
  bool shouldRepaint(covariant _GlobePainter oldDelegate) {
    return oldDelegate.rotationAngle != rotationAngle;
  }
}
