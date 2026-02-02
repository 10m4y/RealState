# 🏡 RealState — Property Listing Progressive Web App

A full-featured Property Listing Web Application built with React, Supabase, and Vite, enhanced as a Progressive Web App (PWA). The application allows users to browse, add, edit, delete, compare, and view properties with offline support and mobile installation.

## 🔗 Live Demo

👉 Deployed on Vercel: [https://real-state-kappa-lovat.vercel.app](https://real-state-lemon-nine.vercel.app/)

## ✨ Features Overview

### Core Features

- 🔍 Browse all available properties
- ➕ Add new property listings
- ✏️ Edit existing property details
- 🗑️ Delete owned properties
- 📄 View detailed property information
- 📊 Compare up to 3 properties side-by-side
- 📱 Fully responsive (mobile & desktop)

### Advanced Features

- 🖼️ Image upload using Supabase Storage
- 💾 Persistent user data using localStorage
- 📞 Click-to-call & message property owners
- 🔁 Optimized loading & error states
- 📴 Offline support with Service Worker caching
- 📲 Installable PWA (Add to Home Screen)

## 🧠 Tech Stack

### Frontend
- React (Functional Components & Hooks)
- React Router DOM
- Vite
- CSS Modules / Custom CSS

### Backend / Services
- **Supabase**
  - PostgreSQL Database
  - Storage Buckets for Images
  - Row Level Security (RLS)

### PWA
- vite-plugin-pwa
- Workbox Runtime Caching
- Web App Manifest
- Service Worker

### Deployment
- Vercel

## 🗂️ Project Structure

```
src/
│
├── components/
│   ├── NavBar.jsx
│   ├── PropertyCard.jsx
│   ├── ComparisonSidebar.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── PropertyList.jsx
│   ├── PropertyDetails.jsx
│   ├── AddEditProperty.jsx
│   ├── MyProperties.jsx
│   ├── PropertyComparison.jsx
│
├── services/
│   └── supabaseClient.js
│
├── styling/
│   ├── Home.css
│   ├── PropertyList.css
│   ├── PropertyDetails.css
│   ├── AddEditProperty.css
│   ├── MyProperties.css
│   ├── PropertyComparison.css
│
├── App.jsx
├── main.jsx
```


## 🖼️ Image Upload (Supabase Storage)

- **Bucket used:** `property-image`
- Images uploaded with unique filenames
- Public URLs retrieved and stored in DB
- Preview shown before upload

## 📴 Offline Support (PWA)

### Implemented Using:
- vite-plugin-pwa
- Workbox NetworkFirst strategy

### What Works Offline:
- App shell (HTML, CSS, JS)
- Previously fetched property lists
- Previously visited property detail pages

### What Does Not Work Offline:
- Creating, editing, deleting properties
- Fetching new data from Supabase

*This behavior is expected and aligns with standard PWA patterns.*

## 📲 Progressive Web App (PWA)

- Installable on Android, iOS, Desktop
- Standalone mode (no browser UI)
- Offline fallback for cached data
- Auto-updating service worker

### PWA Checklist
- ✅ Web App Manifest
- ✅ Service Worker
- ✅ HTTPS (Vercel)
- ✅ Lighthouse PWA compliant

## 🧪 Lighthouse Scores (Production)

- **Performance:** ~100
- **Accessibility:** ~91
- **Best Practices:** ~73
- **SEO:** ~100
- **PWA:** ~98

## 🔐 Environment Variables

Create a `.env` file locally:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Configured securely in Vercel Dashboard for production.

## 🚀 Deployment

### Platform
Vercel

### Build Settings
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`


## 🛠️ Setup Instructions (Local)

```bash
git clone https://github.com/10m4y/RealState
cd RealState
npm install
npm run dev
```

## 📝 Notes & Trade-offs

- Authentication is simulated using localStorage (no Supabase Auth)
- Offline CRUD is intentionally not supported
- Security headers are handled by Vercel in production
- Focused on clean UI, UX, and PWA compliance

## 🎯 Future Enhancements

- Supabase Authentication
- Background Sync for offline writes
- IndexedDB caching
- Google Maps integration
- User favorites & saved listings

## 👨‍💻 Author

**Tanmay Sharma**

Built as a full-stack React + Supabase + PWA project.
