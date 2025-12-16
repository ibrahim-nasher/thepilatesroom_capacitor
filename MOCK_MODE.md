# Mock Data Mode

The app now supports a **Mock Data Mode** for testing when the API is unavailable or returns no data.

## Quick Start

### Enable Mock Mode
```bash
# Edit .env
VITE_USE_MOCK_DATA=true

# Rebuild
npm run build
npm run sync
```

### Disable Mock Mode
```bash
# Edit .env
VITE_USE_MOCK_DATA=false

# Rebuild
npm run build
npm run sync
```

## What's Mocked

### Categories (3)
- Reformer Pilates
- Mat Pilates  
- Barre

### Classes (Dynamic)
- **6-8 classes per day** for any date range
- **Time slots**: 6:00 AM - 7:30 PM (10 slots)
- **Instructors**: Sarah Johnson, Emma Williams, Lisa Brown, Maria Garcia
- **Types**: 70% group (12 capacity), 30% private (2 capacity)
- **Availability**: Random booking levels, some full classes
- **Realistic data**: spots remaining, waitlist status, durations

### Packages (2)
- **10 Class Package**: 7/10 credits remaining
- **Unlimited Monthly**: 15/999 credits used

### Bookings & Waitlist
- Sample booking history
- Mock waitlist classes
- Full booking flow with success responses

## Console Indicators

When mock mode is enabled, you'll see:

```
🔧 MOCK MODE ENABLED
Using mock data instead of real API. Set VITE_USE_MOCK_DATA=false to use real API.
```

All mock operations are logged with `[MOCK]` prefix:
```
[MOCK] Getting categories
[MOCK] Getting schedules by date: 2024-12-15
[MOCK] Adding to waitlist
```

## Network Simulation

Mock requests include realistic delays:
- Default: 500ms
- Availability check: 300ms
- Booking creation: 800ms

## Testing Scenarios

### 1. Browse Classes
- Select different dates → see dynamic classes
- Filter by category → see filtered results
- View different times and instructors

### 2. Book a Class
- Click book button → see package selection
- Select package → see confirmation
- Confirm → success message

### 3. Waitlist
- Find full class (0 spots)
- Click waitlist icon
- See success message

### 4. Package Selection
- Open booking modal
- See 2 packages with credits
- Select and proceed

## Implementation Details

### Files
- `src/services/api/mockData.ts` - Mock data and generators
- `src/services/api/classes.ts` - Conditional mock support
- `src/services/api/bookings.ts` - Conditional mock support
- `.env` - VITE_USE_MOCK_DATA flag

### Code Pattern
```typescript
if (isMockMode()) {
  console.log('[MOCK] Operation name');
  await mockDelay();
  return mockData;
}
// Real API call
```

### Type Safety
All mock data uses the same TypeScript interfaces as real API responses, ensuring seamless switching.

## Development Workflow

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Open in Browser**
   - http://localhost:5173
   - Open DevTools Console
   - See mock mode indicator

3. **Test Features**
   - Browse classes (dynamic data)
   - Book classes (full flow)
   - Join waitlist (immediate feedback)

4. **Switch to Real API**
   - When backend is ready
   - Just toggle env variable
   - No code changes needed

## API Endpoints Covered

### Classes API
- ✅ GET /v1/category/ (categories)
- ✅ GET /v1/category/:id (category by ID)
- ✅ GET /v1/classes/ (class schedules with filters)
- ✅ Custom: getSchedulesByDate (date + category filter)

### Bookings API
- ✅ POST /v1/user/checkBookingAvailability
- ✅ POST /v1/user/addBooking
- ✅ GET /v1/user/getUserBookings
- ✅ GET /v1/user/getActivePackages
- ✅ POST /v1/user/addToWaitlist
- ✅ POST /v1/user/removeFromWaitlist
- ✅ GET /v1/user/getMyWaitlist

## Notes

- Mock data is **generated dynamically** - each date gets fresh classes
- **No persistence** - refresh resets everything
- **Realistic patterns** - mimics real API structure exactly
- **Full type safety** - uses same interfaces as real API

## Troubleshooting

### Classes not showing?
1. Check `.env` has `VITE_USE_MOCK_DATA=true`
2. Rebuild: `npm run build`
3. Check console for orange badge

### Still seeing API errors?
Mock mode only works for implemented endpoints. Some features may still call real API.

### Want to test real API?
Set `VITE_USE_MOCK_DATA=false` and `VITE_APP_ENV=dev` to use development server.
