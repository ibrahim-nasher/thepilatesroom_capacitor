# Project Comparison: Android vs iOS

## Similarities

| Aspect | Both Platforms |
|--------|----------------|
| **Architecture** | Both use similar MVC/MVVM-like patterns with ViewModels/Interactors |
| **Authentication** | Firebase Phone Auth with OTP verification |
| **API Communication** | REST API calls to same backend (`https://dev.the-pilatesroom.com/prod/api/v1/`) |
| **Push Notifications** | Firebase Cloud Messaging (FCM) |
| **Payment Gateway** | HyperPay (OPPWAMobile) with Apple Pay/Google Pay support, MADA, Credit/Debit cards |
| **Localization** | Multi-language support (English/Arabic) with RTL |
| **Features** | Identical business logic - booking, classes, packages, profiles, notifications |
| **Image Loading** | Remote image loading libraries (Glide/Kingfisher) |
| **Storage** | Encrypted local storage for user data and tokens |

## Differences

| Aspect | Android (Kotlin) | iOS (Swift) |
|--------|------------------|-------------|
| **UI Framework** | XML Layouts + DataBinding | Storyboards + XIBs |
| **Navigation** | Navigation Component (SafeArgs) | VIPER-style Routers |
| **Networking** | Retrofit + OkHttp | Alamofire |
| **DI Pattern** | Manual singleton/ViewModelProvider | Service injection via Routers |
| **State Management** | LiveData + Observable | Delegates + Closures |
| **Country Picker** | Custom Module (`countryCode`) | `MICountryPicker` pod |
| **Calendar Component** | `SingleRowCalendar` library | Custom `UICollectionView` |
| **Text Fields** | Custom styling | Material Components (MDCOutlinedTextField) |
| **Keyboard Handling** | Manual handling | IQKeyboardManager |
| **Crash Reporting** | Firebase Crashlytics | CocoaLumberjack + Crashlytics |

## Android Project Structure

```
thepilatesroom_android/
├── app/
│   ├── build.gradle
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── java/com/pilates/room/
│   │   │   ├── MainActivity.kt
│   │   │   ├── MyApp.kt
│   │   │   ├── base/
│   │   │   ├── bind/
│   │   │   ├── module/
│   │   │   │   ├── booking/
│   │   │   │   ├── classes/
│   │   │   │   ├── fcm/
│   │   │   │   ├── home/
│   │   │   │   ├── notifications/
│   │   │   │   ├── packages/
│   │   │   │   ├── payment/
│   │   │   │   ├── profile/
│   │   │   │   ├── settings/
│   │   │   │   ├── splash/
│   │   │   │   └── user/
│   │   │   ├── network/
│   │   │   └── utils/
│   │   └── res/
│   └── libs/ (HyperPay SDK)
├── countryCode/ (Custom module)
└── gradle/
```

## iOS Project Structure

```
thepilatesroom_ios/
├── Pilates/
│   ├── Podfile
│   ├── Pilates/
│   │   ├── Main/
│   │   │   ├── AppDelegate.swift
│   │   │   ├── MainRouter.swift
│   │   │   └── SceneDelegate.swift
│   │   ├── Modules/
│   │   │   ├── OnBoarding/
│   │   │   ├── PersonalDetails/
│   │   │   ├── Tabs/
│   │   │   │   ├── Classes/
│   │   │   │   ├── Home/
│   │   │   │   ├── Notification/
│   │   │   │   ├── Package/
│   │   │   │   ├── Profile/
│   │   │   │   └── TabBar/
│   │   │   └── UserManagement/
│   │   ├── Services/
│   │   │   ├── CategoryService/
│   │   │   ├── GalleryService/
│   │   │   ├── NetworkService/
│   │   │   ├── NotificationService/
│   │   │   ├── PackageService/
│   │   │   ├── PaymentService/
│   │   │   ├── StorageService/
│   │   │   └── UserService/
│   │   ├── Models/
│   │   ├── Helpers/
│   │   ├── Common/
│   │   └── Resources/
│   ├── OPPWAMobile.xcframework/
│   └── ipworks3ds_sdk.xcframework/
```

## Dependencies Comparison

### Android (build.gradle)

```gradle
// Core
implementation "androidx.core:core-ktx"
implementation "androidx.appcompat:appcompat"
implementation "com.google.android.material:material"

// Navigation
implementation "androidx.navigation:navigation-fragment-ktx"
implementation "androidx.navigation:navigation-ui-ktx"

// Networking
implementation "com.squareup.retrofit2:retrofit"
implementation "com.squareup.retrofit2:converter-gson"
implementation "com.squareup.okhttp3:okhttp"
implementation "com.squareup.okhttp3:logging-interceptor"

// Firebase
implementation "com.google.firebase:firebase-auth-ktx"
implementation "com.google.firebase:firebase-messaging-ktx"
implementation "com.google.firebase:firebase-crashlytics-ktx"

// Image Loading
implementation "com.github.bumptech.glide:glide"

// UI Components
implementation "com.intuit.sdp:sdp-android" // Scalable DP
implementation "com.tbuonomo:dotsindicator" // Pager indicator
implementation "io.github.chaosleung:pinview" // OTP input
implementation "com.michalsvec:single-row-calednar" // Calendar

// Security
implementation "androidx.security:security-crypto"

// Payment
implementation files('libs/oppwa.mobile.aar')
implementation files('libs/ipworks3ds_sdk.aar')

// Maps
implementation "com.google.maps.android:maps-ktx"
```

### iOS (Podfile)

```ruby
pod 'R.swift'                    # Resource generation
pod 'IQKeyboardManagerSwift'     # Keyboard handling
pod 'CocoaLumberjack/Swift'      # Logging
pod 'Alamofire'                  # Networking
pod 'ReachabilitySwift'          # Network status
pod 'SwiftLint'                  # Code linting
pod 'SVProgressHUD'              # Loading indicator
pod 'SwiftyJSON'                 # JSON parsing
pod 'Kingfisher'                 # Image loading
pod 'DropDown'                   # Dropdown component
pod 'FloatingPanel'              # Bottom sheets
pod 'MaterialComponents'         # Material text fields
pod 'MDFInternationalization'    # RTL support
pod 'FirebaseAuth'               # Authentication
pod 'TagListView'                # Tags UI
pod 'FirebaseMessaging'          # Push notifications

# Native SDK Frameworks
OPPWAMobile.xcframework          # HyperPay Payment
ipworks3ds_sdk.xcframework       # 3DS Authentication
```

## Screen Mapping

| Screen | Android Fragment | iOS ViewController |
|--------|-----------------|-------------------|
| Splash | `SplashFragment` | Initial in `MainRouter` |
| Onboarding | `OnBoardingFragment` | `OnboardingRouter` |
| Login | `LoginFragment` | `LoginViewController` |
| OTP Verify | `OtpVerifyDialog` | `VerifyOTPViewController` |
| Sign Up | `SignUpFormFragment` | `RegisterViewController` |
| Home | `HomeFragment` | `HomeViewController` |
| Category Detail | `CategoryDetailFragment` | `CategoryDetailViewController` |
| Booking | `BookingFragment` | `BookingViewController` |
| Classes | `ClassFragment` | `ClassesViewController` |
| Class Detail | `ClassDetailFragment` | `ClassDetailViewController` |
| Freeze Class | `FreezeClassDialog` | `FreezeClassViewController` |
| Reschedule | `RescheduleClassFragment` | `RescheduleClassViewController` |
| Packages | `PackageFragment` | `PackageViewController` |
| Payment | `PaymentFragment` | `PaymentViewController` |
| Payment Gateway | `PaymentSelectionFragment` | `PaymentGatewayViewController` |
| Profile | `ProfileFragment` | `ProfileViewController` |
| Edit Profile | `EditProfileFragment` | `EditProfileViewController` |
| Settings | `SettingsFragment` | In Profile |
| Notifications | `NotificationFragment` | `NotificationViewController` |
| Change Language | In Settings | `ChangeLanguageViewController` |
| Webview | `WebviewFragment` | `WKWebView` inline |
