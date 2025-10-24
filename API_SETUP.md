# 🏠 Realtor.com API Setup Guide

## Quick Start (5 minutes)

### Step 1: Get Your RapidAPI Key

1. Go to **https://rapidapi.com/**
2. Click **"Sign Up"** (free account)
3. Verify your email
4. Go to **https://rapidapi.com/apidojo/api/realtor**
5. Click **"Subscribe to Test"**
6. Choose **"Basic"** plan (FREE - 500 requests/month)
7. Copy your **API Key** (you'll see it in the code snippets section)

### Step 2: Add API Key to Your Project

1. In your HomeMatch folder, create a file called `.env.local`
2. Add this line:
   ```
   NEXT_PUBLIC_RAPIDAPI_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual API key

### Step 3: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 4: Test It!

1. Open **http://localhost:3002**
2. You'll see a **"Use Real Listings"** toggle in the top-right
3. Check the box to load real Charlottesville properties!

---

## What You Get

### Free Tier (Basic Plan)
- ✅ **500 requests/month**
- ✅ Real MLS data from Realtor.com
- ✅ Property photos (up to 6 per listing)
- ✅ Property details (beds, baths, sqft, price, etc.)
- ✅ Property descriptions
- ✅ Address & coordinates
- ✅ HOA information
- ✅ Days on market

### Paid Tiers
- **Pro Plan:** $30/month - 10,000 requests
- **Ultra Plan:** $200/month - 100,000 requests
- **Mega Plan:** $700/month - Unlimited requests

---

## How It Works

1. **Mock Data by Default** - App loads with 30 fake Virginia properties
2. **Toggle Real Data** - Check "Use Real Listings" to fetch from API
3. **Automatic Fallback** - If API fails, falls back to mock data
4. **API Call Savings** - Only fetches when you toggle on (saves your quota)

---

## API Endpoints Used

### 1. **Search Properties**
```
POST /properties/v3/list
```
- Search by city, state, zip
- Filter by status (for_sale, sold, etc.)
- Sort by list date, price, etc.
- Limit results

### 2. **Get Property Details**
```
GET /properties/v3/detail
```
- Get full details by property ID
- Used for future "View Details" feature

---

## Troubleshooting

### "Use Real Listings" toggle not showing?
- Check that `.env.local` file exists
- Verify API key is set correctly
- Restart dev server after adding .env.local

### API returns no properties?
- Check Charlottesville, VA has active listings
- Try different city: Update line 27 in `app/page.tsx`
- Check RapidAPI dashboard for quota/errors

### API quota exceeded?
- You've used 500 requests this month
- Wait until next month, or upgrade plan
- App automatically falls back to mock data

### CORS errors?
- Realtor API should work from localhost
- If issues persist, check RapidAPI dashboard

---

## Next Steps

### Want to customize the search?

Edit `app/page.tsx` line 27:

```typescript
// Change city/state
const realProperties = await searchProperties('Richmond', 'VA', 30);

// Or search by zip code (edit realtorApi.ts)
```

### Want to add more filters?

Edit `services/realtorApi.ts` in the `searchProperties` function:

```typescript
body: JSON.stringify({
  limit: limit,
  status: ['for_sale'],
  price_min: 200000,    // Add minimum price
  price_max: 1000000,   // Add maximum price
  beds_min: 3,          // Minimum bedrooms
  baths_min: 2,         // Minimum bathrooms
  // ... more filters
})
```

---

## Cost Breakdown

**Free tier is perfect for development:**
- 500 requests/month = ~16 requests/day
- Each property search = 1 request
- Testing the app daily = well within limits

**When to upgrade:**
- **10+ users/day:** Upgrade to Pro ($30/month)
- **100+ users/day:** Upgrade to Ultra ($200/month)
- **Production app:** Consider Mega or custom enterprise pricing

---

## File Structure

```
HomeMatch/
├── services/
│   └── realtorApi.ts          # API integration logic
├── app/
│   └── page.tsx               # Main page with toggle
├── .env.local                 # Your API key (DO NOT COMMIT)
├── .env.local.example         # Template
└── API_SETUP.md              # This file
```

---

## Security Notes

⚠️ **IMPORTANT:**
- `.env.local` is in `.gitignore` - never commit your API key!
- API key is prefixed with `NEXT_PUBLIC_` so it works in browser
- This is OK for this use case (public listings only)
- For production with sensitive data, use server-side API routes

---

## Support

- **RapidAPI Help:** https://rapidapi.com/apidojo/api/realtor/discussions
- **Documentation:** https://rapidapi.com/apidojo/api/realtor
- **Pricing:** https://rapidapi.com/apidojo/api/realtor/pricing

---

**Happy House Hunting! 🏡**
