# ZMDB — Personal Movie & Series Tracker

A warm, Italian-restaurant & trattoria-themed movie and television tracking web application built with **React 18+**, **Vite**, and **React Router**, powered by the **OMDb API**.

---

## 🍝 Features

- **OMDb API Integration**: Live search across millions of titles with debouncing, format filters (Movie / Series), year filter, in-memory caching, and pagination.
- **Shelf Management**:
  - **Default Status Shelves**: *Watched*, *Watching*, and *Want to Watch*. A title can belong to only one default status shelf at a time (moving it automatically shifts it).
  - **Custom Shelves**: Create, rename, and delete custom shelves (e.g., "Weekend Binge", "Italian Classics", "Horror Nights"). Titles can belong to multiple custom collections simultaneously.
  - **Collage Previews & Stats**: Visual poster collages on the shelves page and a "Trophy Case" stats counter on the home page.
  - **Sorting & Filtering**: Sort shelf titles by Recently Added, Title (A–Z), and Release Year, and filter by Movie vs. Series.
- **Rich Title Details**: Full plot synopses, director, writer, cast, IMDb rating, Rotten Tomatoes tomatometer score, total seasons for series, and genre tags. All missing `"N/A"` rows are cleanly omitted.
- **Responsive & Accessible**:
  - Mobile (<640px): Bottom tab bar, 2-column poster grid, slide-up bottom sheet for shelf operations.
  - Desktop (≥1024px): Sticky top navigation with brand logo, wide search bar with keyboard shortcut (`/` to focus), and popover menus.
  - Semantic HTML, focus rings, touch targets (≥44px), and `aria-live` toast announcements.
- **Data Persistence**: Offline-ready snapshot model stored in `localStorage` under `zmdb:v1:shelves` and `zmdb:v1:items` with error recovery for corrupted data.

---

## 🛠️ Tech Stack

- **React 19** with **Vite**
- **React Router 7** for routing and URL-synced search queries
- **Lucide React** for lightweight, accessible icons
- **Plain CSS with CSS Tokens**: Italian-restaurant color palette and design tokens defined in `src/styles/tokens.css`
- **Context + `useReducer`**: Predictable shelf state management without heavy external libraries
- **Storage Service**: Encapsulated `src/services/storage.js` for seamless future backend migrations

---

## 📖 API Reference & Documentation

- **OMDb API Documentation**: [https://www.omdbapi.com/](https://www.omdbapi.com/)
- All title and search data in ZMDB is retrieved directly from the official OMDb API.
- All requests use `https://www.omdbapi.com/`.

---

## 🚀 Setup Instructions

### 1. Clone or Open Project
```bash
cd movie-series-store
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure OMDb API Key
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and add your free API key from [omdbapi.com](https://www.omdbapi.com/apikey.aspx):
```env
VITE_OMDB_API_KEY=your_key_here
```

*(Note: ZMDB also allows entering an API key directly inside the app via the header "Set API Key" dialog, which persists locally in your browser).*

### 4. Start Development Server
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## ⚖️ Disclaimer

ZMDB uses the [OMDb API](https://www.omdbapi.com/) and is not affiliated with IMDb.
