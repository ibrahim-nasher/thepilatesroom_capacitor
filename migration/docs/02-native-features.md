# Native Features Analysis

This document lists all native features and APIs used in the Android and iOS applications that need to be addressed during migration to Capacitor.

## 1. Authentication & Security

### 1.1 Firebase Phone Authentication
- **Android:** `FirebaseAuth`, `PhoneAuthProvider`, `PhoneAuthCredential`
- **iOS:** `FirebaseAuth`, `PhoneAuthProvider`
- **Description:** OTP-based login using Firebase Phone Auth
- **Capacitor Solution:** `@capacitor-firebase/authentication`

### 1.2 Encrypted Storage
- **Android:** `EncryptedSharedPreferences` with AES256 encryption
- **iOS:** Keychain via `UserDefaults` with encoding
- **Description:** Secure storage for tokens and sensitive user data
- **Capacitor Solution:** `@capacitor/preferences` + `capacitor-secure-storage-plugin`

### 1.3 Firebase Auth Token Management
- **Android:** `FirebaseAuth.getInstance().currentUser.getIdToken()`
- **iOS:** `Auth.auth().currentUser?.getIDToken()`
- **Description:** JWT token refresh for API authentication
- **Capacitor Solution:** `@capacitor-firebase/authentication`

---

## 2. Push Notifications

### 2.1 Firebase Cloud Messaging (FCM)
- **Android:** `FirebaseMessagingService`, `RemoteMessage`
- **iOS:** `FirebaseMessaging`, `UNUserNotificationCenter`
- **Description:** Remote push notification handling
- **Capacitor Solution:** `@capacitor/push-notifications` + `@capacitor-firebase/messaging`

### 2.2 Local Notification Channels (Android)
- **Android:** `NotificationChannel`, `NotificationManager`
- **iOS:** N/A (handled by system)
- **Description:** Notification categorization for Android 8+
- **Capacitor Solution:** `@capacitor/local-notifications`

### 2.3 APNs Integration (iOS)
- **Android:** N/A
- **iOS:** `UIApplication.shared.registerForRemoteNotifications()`
- **Description:** Device token registration for iOS
- **Capacitor Solution:** Handled by `@capacitor/push-notifications`

### 2.4 Background/Foreground Notification Handling
- **Android:** `onMessageReceived()` in service
- **iOS:** `UNUserNotificationCenterDelegate` methods
- **Description:** Different handling based on app state
- **Capacitor Solution:** `@capacitor/push-notifications` listeners

---

## 3. Payment Processing

### 3.1 HyperPay SDK (OPPWAMobile)
- **Android:** `oppwa.mobile.aar` - `OPPPaymentProvider`, `OPPTransaction`
- **iOS:** `OPPWAMobile.xcframework` - `OPPPaymentProvider`, `OPPTransaction`
- **Description:** Credit/Debit card payment processing
- **Capacitor Solution:** **Custom Capacitor Plugin Required**

### 3.2 Apple Pay
- **Android:** N/A
- **iOS:** `PKPaymentRequest`, `OPPCheckoutProvider` with Apple Pay
- **Description:** Native Apple Pay payment sheet
- **Capacitor Solution:** Custom plugin or `@nickmohnsen/capacitor-apple-pay`

### 3.3 3DS Authentication
- **Android:** `ipworks3ds_sdk.aar`
- **iOS:** `ipworks3ds_sdk.xcframework`
- **Description:** 3D Secure payment verification
- **Capacitor Solution:** Part of custom HyperPay plugin

### 3.4 MADA Payment
- **Android:** Card type detection in HyperPay
- **iOS:** MADA card brand in HyperPay
- **Description:** Saudi debit card (MADA) integration
- **Capacitor Solution:** Part of custom HyperPay plugin

### 3.5 Payment Deep Linking
- **Android:** `intent-filter` with scheme `pilates://`
- **iOS:** URL scheme `com.pilates.room.payments://result`
- **Description:** Payment callback handling via deep links
- **Capacitor Solution:** `@capacitor/app` for App URL Open events

---

## 4. Camera & Media

### 4.1 Camera Access
- **Android:** `ActivityResultContracts.TakePicture()`
- **iOS:** `UIImagePickerController` with `.camera` source
- **Description:** Capture photo for profile picture
- **Capacitor Solution:** `@capacitor/camera`

### 4.2 Photo Library Access
- **Android:** `ActivityResultContracts.GetContent("image/*")`
- **iOS:** `PHPickerViewController`
- **Description:** Select image from device gallery
- **Capacitor Solution:** `@capacitor/camera` with `CameraSource.Photos`

### 4.3 Photo Permissions
- **Android:** `READ_MEDIA_IMAGES`, `READ_EXTERNAL_STORAGE` (legacy)
- **iOS:** `NSPhotoLibraryUsageDescription`
- **Description:** Runtime permission requests
- **Capacitor Solution:** Handled by `@capacitor/camera`

### 4.4 Image Compression/Upload
- **Android:** `FileProvider`, multipart upload via Retrofit
- **iOS:** `UIImage` compression, Alamofire multipart
- **Description:** Compress and upload profile images
- **Capacitor Solution:** Base64 from Camera + Axios/Fetch multipart

---

## 5. Device Features

### 5.1 Device UUID
- **Android:** N/A (using FCM token)
- **iOS:** `UIDevice.current.identifierForVendor?.uuidString`
- **Description:** Unique device identification for push registration
- **Capacitor Solution:** `@capacitor/device`

### 5.2 Network State Monitoring
- **Android:** `ACCESS_NETWORK_STATE` permission, custom checks
- **iOS:** `Reachability` pod
- **Description:** Internet connectivity monitoring
- **Capacitor Solution:** `@capacitor/network`

### 5.3 Haptic Feedback
- **Android:** N/A (not implemented)
- **iOS:** `HapticFeedback.selectionFeedback()` custom helper
- **Description:** Tactile feedback on button taps
- **Capacitor Solution:** `@capacitor/haptics`

---

## 6. UI/UX Native Components

### 6.1 Custom Tab Bar / Bottom Navigation
- **Android:** Navigation Component with `BottomNavigationView`
- **iOS:** `UITabBarController` via `TabBarRouter`
- **Description:** Main app navigation (Home, Classes, Packages, Profile)
- **Capacitor Solution:** React component with CSS styling

### 6.2 Pull-to-Refresh
- **Android:** `SwipeRefreshLayout`
- **iOS:** `UIRefreshControl`
- **Description:** Refresh lists by pulling down
- **Capacitor Solution:** CSS + React implementation or library

### 6.3 Floating Panel / Bottom Sheet
- **Android:** `BottomSheetDialogFragment`
- **iOS:** `FloatingPanel` pod
- **Description:** Modal bottom sheets for details/actions
- **Capacitor Solution:** CSS modal with animation

### 6.4 Date Picker
- **Android:** `DatePickerDialog`
- **iOS:** Custom `MyDatePicker` component
- **Description:** Date selection for booking
- **Capacitor Solution:** HTML5 date input or custom React component

### 6.5 Country Code Picker
- **Android:** Custom `CountryPicker` module with flags
- **iOS:** `MICountryPicker` pod
- **Description:** Phone number input with country selection
- **Capacitor Solution:** React country picker library (e.g., `react-phone-number-input`)

### 6.6 Horizontal Calendar
- **Android:** `SingleRowCalendar` library
- **iOS:** Custom `UICollectionView`
- **Description:** Scrollable date selection for classes
- **Capacitor Solution:** Custom React component with horizontal scroll

### 6.7 OTP Input
- **Android:** `PinView` library
- **iOS:** Custom text fields
- **Description:** 6-digit OTP code entry
- **Capacitor Solution:** React OTP input component

### 6.8 Progress HUD / Loading Indicators
- **Android:** Custom progress dialog
- **iOS:** `SVProgressHUD` pod
- **Description:** Full-screen loading overlay
- **Capacitor Solution:** React loading component with CSS

---

## 7. Storage & Persistence

### 7.1 UserDefaults / SharedPreferences
- **Android:** `SharedPreferences` via `MyPreference` object
- **iOS:** `UserDefaults` via `LocalStorageService`
- **Description:** App settings and cached data
- **Capacitor Solution:** `@capacitor/preferences`

### 7.2 JSON Encoding/Decoding
- **Android:** Gson library
- **iOS:** `JSONEncoder`/`JSONDecoder`, SwiftyJSON
- **Description:** Serialize/deserialize data objects
- **Capacitor Solution:** Native JavaScript JSON methods

---

## 8. System Integration

### 8.1 Deep Linking / URL Schemes
- **Android:** `intent-filter` with `android:scheme="pilates"`
- **iOS:** URL Types in Info.plist
- **Description:** Handle app URLs for payments and navigation
- **Capacitor Solution:** `@capacitor/app` - `appUrlOpen` listener

### 8.2 App State Lifecycle
- **Android:** Activity lifecycle callbacks
- **iOS:** `SceneDelegate` / `AppDelegate` lifecycle
- **Description:** Handle app foreground/background transitions
- **Capacitor Solution:** `@capacitor/app` - `appStateChange` listener

### 8.3 Screen Orientation Lock
- **Android:** `android:screenOrientation="portrait"` in manifest
- **iOS:** Supported orientations in project settings
- **Description:** Force portrait mode only
- **Capacitor Solution:** `@capacitor/screen-orientation`

### 8.4 Locale/Language Switching
- **Android:** `LocaleManager` with `Configuration` changes
- **iOS:** `LocalizationHelper` with app restart
- **Description:** Runtime language change (English/Arabic) with RTL
- **Capacitor Solution:** i18next + CSS `direction` property

---

## 9. Networking

### 9.1 HTTP Client Configuration
- **Android:** Retrofit + OkHttp with interceptors
- **iOS:** Alamofire with session configuration
- **Description:** REST API communication with timeouts
- **Capacitor Solution:** Axios or Fetch API

### 9.2 Auth Token Interceptor
- **Android:** `HttpHandleIntercept` OkHttp interceptor
- **iOS:** Custom Alamofire request modifier
- **Description:** Inject Bearer token in all API requests
- **Capacitor Solution:** Axios request interceptor

### 9.3 Multipart File Upload
- **Android:** Retrofit `@Multipart` annotation
- **iOS:** Alamofire `upload` with `MultipartFormData`
- **Description:** Upload profile images
- **Capacitor Solution:** FormData with Fetch/Axios

### 9.4 SSL/Network Security
- **Android:** `network_security_config.xml` allowing cleartext
- **iOS:** `NSAppTransportSecurity` settings
- **Description:** HTTPS enforcement with dev exceptions
- **Capacitor Solution:** Configured in native project settings

---

## 10. Analytics & Monitoring

### 10.1 Firebase Crashlytics
- **Android:** `firebase-crashlytics-ktx`
- **iOS:** Firebase Crashlytics SDK
- **Description:** Crash reporting and analytics
- **Capacitor Solution:** `@capacitor-firebase/crashlytics`

### 10.2 Debug Logging
- **Android:** Custom `DebugLog` utility
- **iOS:** `CocoaLumberjack` framework
- **Description:** Development logging
- **Capacitor Solution:** Console.log + production log service

---

## Summary: Capacitor Plugins Required

| Feature Category | Capacitor Plugin |
|-----------------|------------------|
| Firebase Auth | `@capacitor-firebase/authentication` |
| Push Notifications | `@capacitor/push-notifications` |
| Camera/Gallery | `@capacitor/camera` |
| Local Storage | `@capacitor/preferences` |
| Secure Storage | `capacitor-secure-storage-plugin` |
| Network Status | `@capacitor/network` |
| Device Info | `@capacitor/device` |
| Haptics | `@capacitor/haptics` |
| App Lifecycle | `@capacitor/app` |
| Screen Orientation | `@capacitor/screen-orientation` |
| Crashlytics | `@capacitor-firebase/crashlytics` |
| **HyperPay Payment** | **Custom Plugin (to be developed)** |

## Custom Development Required

1. **HyperPay Capacitor Plugin** - Wrap OPPWAMobile SDK for both platforms
2. **Horizontal Calendar Component** - Custom React implementation
3. **Country Picker Component** - With flag icons and dial codes
4. **OTP Input Component** - 6-digit verification code input
5. **Bottom Sheet/Floating Panel** - CSS-based modal sheets
