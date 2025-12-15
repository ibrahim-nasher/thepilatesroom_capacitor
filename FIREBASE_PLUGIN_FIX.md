# Firebase Plugin Compatibility Fix

## Issue
The `@capacitor-firebase/authentication` and `@capacitor-firebase/messaging` plugins (v7.x) have a dependency conflict with Capacitor 8. Their `Package.swift` files require `capacitor-swift-pm` version 7.x, but Capacitor 8 uses version 8.x.

## Solution
We've created an automatic patch script that runs after `npm install` to update the Firebase plugins' Swift package dependencies.

### What it does
The `scripts/patch-firebase-plugins.js` script:
1. Runs automatically after `npm install` (via `postinstall` hook)
2. Updates Firebase plugin Package.swift files
3. Changes `capacitor-swift-pm` dependency from `7.0.0` to `8.0.0`

### Affected Plugins
- `@capacitor-firebase/authentication@7.5.0`
- `@capacitor-firebase/messaging@7.5.0`

### Manual Patching
If needed, you can manually run the patch:
```bash
node scripts/patch-firebase-plugins.js
```

### After Patching
Always run `npx cap sync ios` after patching to update the Xcode project:
```bash
npx cap sync ios
```

## Expected Behavior
- ✅ Xcode builds without "Missing package product 'CapApp-SPM'" error
- ✅ Swift Package Manager resolves all dependencies
- ✅ Both iOS and Android builds work correctly

## Future Updates
When Firebase plugins release Capacitor 8-compatible versions (8.x), this patch can be removed.
