import 'package:flutter_test/flutter_test.dart';
import 'package:globetrotter/data/dummy_data.dart';
import 'package:globetrotter/models/user.dart';
import 'package:globetrotter/services/storage_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('GlobeTrotter Models & Data Layer Tests', () {
    test('User model serialization and deserialization', () {
      const user = DummyData.dummyUser;
      final json = user.toJson();
      final fromJson = User.fromJson(json);

      expect(fromJson.id, equals(user.id));
      expect(fromJson.name, equals(user.name));
      expect(fromJson.email, equals(user.email));
      expect(fromJson.travelScore, equals(920));
    });

    test('Trip model budget progress calculations', () {
      final trip = DummyData.dummyTrips.first;
      expect(trip.totalDays, greaterThan(0));
      expect(trip.citiesCount, equals(3));
      expect(trip.budgetProgress, closeTo(2090.0 / 3200.0, 0.01));
      expect(trip.remainingBudget, equals(3200.0 - 2090.0));
    });

    test('City model and coordinates', () {
      final city = DummyData.dummyCities.first;
      expect(city.name, equals('Paris'));
      expect(city.country, equals('France'));
      expect(city.rating, greaterThanOrEqualTo(4.5));
    });

    test('StorageService session persistence', () async {
      SharedPreferences.setMockInitialValues({});
      final storage = await StorageService.init();

      expect(storage.isLoggedIn, isFalse);
      await storage.setLoggedIn(true);
      expect(storage.isLoggedIn, isTrue);

      await storage.saveUser(DummyData.dummyUser);
      final retrievedUser = storage.getUser();
      expect(retrievedUser?.name, equals(DummyData.dummyUser.name));

      await storage.clearSession();
      expect(storage.isLoggedIn, isFalse);
      expect(storage.getUser(), isNull);
    });
  });
}
