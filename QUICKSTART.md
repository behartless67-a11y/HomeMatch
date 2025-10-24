# HomeMatch - Quick Start Guide

Get your house-hunting app running in 3 minutes!

## What You're Getting

A fully functional Tinder-style house hunting app with:
- Swipe right/left on properties
- Advanced filtering (price, beds, baths, location, features)
- Liked properties dashboard
- 6 demo properties to test with

## Installation (3 steps)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start the App
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: **http://localhost:5173**

That's it! You're ready to start swiping.

## How to Use

### Swiping
- **Drag right** or **click the green checkmark**: Like a property
- **Drag left** or **click the red X**: Pass on a property
- **Click arrow buttons** on the card: View more photos

### Filtering
1. Click the **"Filters"** button in the top right
2. Set your preferences:
   - Price range
   - Minimum bedrooms/bathrooms
   - Property types (house, condo, townhouse, apartment)
   - States
   - Must-have features
3. Click **"Save Preferences"**

Properties will automatically filter based on your selections.

### Viewing Liked Properties
- Click **"View X Liked Properties"** at the bottom
- See all properties you've liked in a grid view
- Click **"Back to Browsing"** to continue swiping

## Customizing the App

### Adding Your Own Properties

Edit `frontend/src/data/mockProperties.ts` to add your own listings:

```typescript
{
  id: '7',
  price: 450000,
  address: '123 Your Street',
  city: 'Your City',
  state: 'CA',
  zipCode: '12345',
  bedrooms: 3,
  bathrooms: 2,
  squareFeet: 2000,
  propertyType: 'house',
  yearBuilt: 2020,
  images: ['https://your-image-url.com/photo.jpg'],
  description: 'Your property description',
  features: ['Feature 1', 'Feature 2'],
  daysOnMarket: 10,
}
```

### Connecting to Real Estate APIs

See [API_INTEGRATION_EXAMPLE.md](./API_INTEGRATION_EXAMPLE.md) for detailed instructions on connecting to real estate data sources.

Quick summary:
1. Sign up for RapidAPI (free tier: 100 requests/month)
2. Get API key
3. Follow integration guide
4. Replace mock data with live data

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── PropertyCard.tsx          # The swipeable card
│   │   ├── SwipeView.tsx             # Main app view
│   │   ├── PreferencesModal.tsx      # Filters popup
│   │   └── LikedPropertiesView.tsx   # Liked properties page
│   ├── data/
│   │   └── mockProperties.ts         # Demo property data
│   └── types/
│       └── Property.ts               # TypeScript types
```

## Troubleshooting

### Port 5173 already in use?
```bash
# Kill the process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill
```

### Dependencies won't install?
```bash
# Clear npm cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Images not loading?
Check your internet connection - the demo uses images from Unsplash CDN.

## Next Steps

1. **Test the app** - Try all features with the demo properties
2. **Customize properties** - Add your own mock data
3. **Get an API key** - Sign up for RapidAPI
4. **Integrate real data** - Follow the API integration guide
5. **Deploy** - Use Vercel, Netlify, or your preferred hosting

## Need Help?

- Check [README.md](./README.md) for full documentation
- See [API_INTEGRATION_EXAMPLE.md](./API_INTEGRATION_EXAMPLE.md) for API setup
- Open an issue on GitHub

## What's Working

✅ Swipe functionality (drag or buttons)
✅ Multi-image galleries
✅ Advanced filtering
✅ Liked properties view
✅ Responsive design
✅ Mock data with 6 properties

## What's Next

⏳ Real estate API integration
⏳ User authentication
⏳ Save preferences to database
⏳ Mobile app (iOS/Android)
⏳ Agent contact integration

---

**Ready to make house hunting fun? Start swiping!** 🏡
