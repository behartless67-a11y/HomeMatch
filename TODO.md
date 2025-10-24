# HomeMatch - TODO List

## 🐛 Bug Fixes / Polish

### High Priority
- [ ] **Increase photo width on mobile** - Cards currently have padding (px-4) on mobile, should be edge-to-edge or wider
  - Current: `w-full max-w-[500px]` with `px-4` container
  - Goal: Make photos take up more screen width on mobile devices
  - File: [components/PropertyCard.tsx](components/PropertyCard.tsx)

### Medium Priority
- [ ] Fix any remaining centering issues on different screen sizes
- [ ] Test on various mobile devices (iPhone, Android)
- [ ] Optimize image loading performance

## 🚀 Features - Next Session

### API Integration (Ready to implement!)
- [ ] Get RapidAPI key from [RapidAPI Realtor API](https://rapidapi.com/apidojo/api/realtor)
- [ ] Add `NEXT_PUBLIC_RAPIDAPI_KEY` to `.env.local`
- [ ] Test real property data integration
- [ ] Add error handling for API failures
- [ ] Add rate limiting awareness

### Budget Calculator
- [ ] Mortgage payment estimator
- [ ] Include property tax estimates
- [ ] Include HOA fees
- [ ] Down payment calculator
- [ ] "Can I afford this?" indicator on each card

### Property Notes & Ratings
- [ ] Add personal notes to each liked property
- [ ] Star rating system (1-5 stars)
- [ ] Tag system (e.g., "dream home", "needs work", "backup")
- [ ] Store in localStorage or backend

### Map View
- [ ] Show all liked properties on interactive map
- [ ] Cluster properties by neighborhood
- [ ] Calculate commute times to work/school
- [ ] Filter by distance/location

## 📱 Mobile Improvements

- [x] Easier swiping (40px threshold + velocity detection)
- [x] No horizontal scrolling
- [x] Touch-friendly UI
- [x] Compact preferences modal
- [ ] **Increase photo width (current task)**
- [ ] Test on various screen sizes
- [ ] PWA support for "Add to Home Screen"

## 🎨 Design Enhancements

- [ ] Dark mode toggle
- [ ] Custom color themes
- [ ] Animation settings (reduce motion option)
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

## 🔧 Technical Improvements

- [ ] Add error boundaries
- [ ] Use Next.js Image component for optimization
- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add E2E tests (Playwright)
- [ ] Performance monitoring
- [ ] Analytics integration

## 📊 Future Features

### Share & Compare
- [ ] Share liked properties via link/email
- [ ] Enhanced side-by-side property comparison
- [ ] Generate PDF of liked properties
- [ ] Export to CSV/Excel

### Tour Scheduling
- [ ] Request showing directly from app
- [ ] Calendar integration
- [ ] Contact agent button
- [ ] Save tour history

### Smart Features
- [ ] Machine learning recommendations
- [ ] "You might also like..." suggestions
- [ ] Price drop alerts
- [ ] New listing notifications
- [ ] Save searches functionality

### Social Features
- [ ] Share with partner/spouse
- [ ] Both can swipe independently
- [ ] "It's a match!" when you both like same property
- [ ] Comments/discussion on properties

## 📝 Documentation

- [x] Update README with current features
- [ ] Add API integration guide
- [ ] Create deployment guide
- [ ] Add contributing guidelines
- [ ] Document component architecture

## 🎯 Business/Legal

- [ ] Fair Housing Act compliance review
- [ ] API terms of service compliance
- [ ] Privacy policy (GDPR/CCPA)
- [ ] Data retention policy
- [ ] Check state licensing requirements

---

**Current Status**: App is production-ready and deployed on Vercel! 🎉

**Last Updated**: 2025-10-24
