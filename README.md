# 🌌 FandomVerse — Portal for Fandom World

A unified, visually rich information hub for fans of **Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga**. Built as a **Single Page Application (SPA)** with **zero backend** — all content is served from pre-populated JSON files.

**Event:** TechWiz 7 — The World Tech Championship
**Organizer:** Aptech Learning
**Category:** Web Innovation Unleashed
**Theme:** Fandom Universe
**Submission Date:** 26 September 2026

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Available Scripts](#-available-scripts)
- [Data Files](#-data-files)
- [Key Modules](#-key-modules)
- [Design System](#-design-system)
- [Responsive Breakpoints](#-responsive-breakpoints)
- [Constraints & Assumptions](#-constraints--assumptions)
- [AI Tools Acknowledged](#-ai-tools-acknowledged)
- [Team](#-team)
- [License & Rights](#-license--rights)
- [Deployment](#-deployment)
- [References](#-references)

---

## 🎯 Project Overview

Fandom communities are scattered across fan wikis, streaming services, social media, ticketing websites, online stores, and news portals. Fans must switch between 5-6 websites just to stay updated on a single fandom.

**FandomVerse** solves this by providing a **single centralized portal** with:

- 7 category hubs (Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga)
- 9 content types per category (Articles, Characters, Events, Trailers, Videos, Audio, Gallery, Merchandise, Releases)
- Cross-category search, filter, and sort
- Bookmarking with personal notes
- Temporary shopping cart (no checkout)
- Rule-based AI chatbot
- 100% responsive design

---

## 🔴 The Problem

### Fragmentation
- Fan wikis for characters
- Streaming services for episodes
- Social media for discussions
- Ticketing sites for events
- Online stores for merchandise
- News portals for updates

### Consequences
- Time-consuming experience
- Inconsistent UI/UX
- Difficult discovery of new fandoms
- Poor accessibility across platforms

---

## 🟢 The Solution

**FandomVerse** — a browser-based, visually engaging **Single Page Application** that combines content from multiple fandom categories into one place.

### Design Principles
| Principle | Description |
|-----------|-------------|
| **Centralization** | All fandoms, one place |
| **Visual Richness** | Media-first cards, hero banners, animations |
| **Fast Discovery** | Search, filter, sort in one flow |
| **Zero Backend** | Fully static — deployable anywhere |
| **Responsive** | Desktop, tablet, mobile |

---

## ✨ Features

### 🏠 Landing / Home Page
- Real-time clock + visitor counter
- Cinematic hero banner with rotating slides (7 sec each)
- Intro section with animated heading and video background
- Featured carousel (articles + trailers + events mixed)
- Mixed content feed (articles + trailers + podcasts)
- Trending sidebar (top 5)
- 7 category rows with horizontal scroll
- "Discover Your Fandom" hover-expand panels
- Upcoming releases preview
- Floating chatbot launcher

### 📂 Category Hub Pages
- 9 content tabs: Articles, Characters, Events, Trailers, Videos, Audio, Gallery, Merchandise, Releases
- Filter by type, sub-tags, traits, status
- Sort by newest, oldest, popularity, A-Z, Z-A
- Breadcrumb navigation
- Empty state handling

### 🔍 Global Search
- Search across all categories and content types
- Debounced input (250ms)
- 9 type filters + 8 category filters
- Sort options
- Load more pagination (60 items per batch)
- 9 card renderers per type

### 📰 Content Detail Page
- Full article read view with tags
- Related content suggestions
- Like, bookmark, share buttons
- Matched trailer sidebar (sticky)
- Personal notes section
- Store / watch links

### 🦸 Character Profiles
- Name, image, series, bio, traits
- Filter by franchise and traits
- 250+ characters across 7 fandoms

### 🎬 Trailers, Videos, Audio
- Dedicated trailers page
- Embedded YouTube players
- Audio player with progress bar
- Filter by category and content type
- In-page playback (no redirect)

### 🖼️ Image Galleries
- Per-category galleries
- Lightbox / modal viewer
- Keyboard navigation (arrows + Escape)

### 🛒 Merchandise & Cart
- Product cards with images, prices, descriptions
- Detail modal with quantity selector
- Add to temporary cart
- Live billing total
- No real checkout (per SRS)

### 🔖 Bookmarking System
- Bookmark any content type
- localStorage persistence
- Personal notes (sessionStorage)
- Filter by category and type
- Sort options
- Excel export (.xls)
- Share modal (WhatsApp, Email, Twitter, Facebook, Telegram, Copy Link)

### 🤖 AI Chatbot (VerseBot)
- Rule-based responses from JSON
- Quick reply prompts (10)
- Navigation links embedded in responses
- Available on all pages (floating)
- Typing indicator + online status

### 📞 Contact Page
- Contact form with validation
- Google Maps embedded (Aptech Metro Star Gate, Karachi)
- GPS "Use My Location" feature
- Social links

### 📅 Releases Calendar
- Month-grouped listing
- Time filter (upcoming/past/all)
- Category filter
- Days-left countdown

### 🎨 UI Features
- Visitor counter (localStorage)
- Real-time clock (live)
- Hover effects with rose-violet glow
- Breadcrumb navigation
- Dummy Login/Signup (UI only)
- Accessibility: focus-visible outlines, skip-to-content link

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19 | Component-based UI |
| **Build Tool** | Vite 8 | Fast dev + optimized build |
| **Router** | React Router DOM 7 | Client-side navigation |
| **Animation** | Framer Motion 13 | Smooth transitions |
| **Styling** | CSS3 + Inline + Tailwind 3 | Utility + custom |
| **Icons** | React Icons 5 | Font Awesome + Material |
| **Data** | JSON files | Pre-populated content |
| **State** | React Hooks | useState, useEffect, useMemo |
| **Storage** | localStorage + sessionStorage | Client-side persistence |
| **Image APIs** | TMDb, Wikipedia, Kitsu, YouTube | Content imagery |

---

## 📁 Project Structure

fandomverse/
├── public/
│ ├── data/ # JSON content files
│ │ ├── content.json # 246 articles
│ │ ├── characters.json # 250+ character profiles
│ │ ├── events.json # 80+ fandom events
│ │ ├── merchandise.json # 55 merchandise items
│ │ ├── trailers.json # 120 trailers
│ │ ├── videos.json # 119 videos
│ │ ├── audio.json # 80 podcasts & interviews
│ │ ├── galleries.json # 80+ gallery images
│ │ ├── releases.json # 12 upcoming releases
│ │ ├── chatbot.json # VerseBot FAQ data
│ │ ├── categories.json # 7 category definitions
│ │ └── gameLinks.json # Store links
│ ├── images/
│ │ ├── banners/ # Series banners
│ │ ├── merchandise/ # Product images
│ │ │ ├── anime/
│ │ │ ├── gaming/
│ │ │ ├── movies/
│ │ │ ├── manga/
│ │ │ ├── movie/
│ │ │ └── kpop/
│ │ └── Logo/ # FandomVerse logo
│ └── robots.txt
│
├── scripts/ # One-time data utilities
│ ├── mark-featured.mjs
│ ├── trim-merchandise.mjs
│ └── ...
│
├── src/
│ ├── components/ # 40+ reusable components
│ │ ├── Navbar.jsx
│ │ ├── Footer.jsx
│ │ ├── SmartImage.jsx # Image loader with fallback
│ │ ├── Breadcrumbs.jsx
│ │ ├── Chatbot.jsx # VerseBot
│ │ ├── ContentCard.jsx
│ │ ├── CharacterCard.jsx
│ │ ├── EventCard.jsx
│ │ ├── MerchandiseCard.jsx
│ │ ├── MerchandiseDetailModal.jsx
│ │ ├── TrailerCard.jsx
│ │ ├── VideoCard.jsx
│ │ ├── AudioCard.jsx
│ │ ├── GalleryGrid.jsx
│ │ ├── NotesModal.jsx
│ │ ├── ShareModal.jsx
│ │ ├── LoginModal.jsx
│ │ └── ...
│ │
│ ├── pages/ # Route-level pages
│ │ ├── Home.jsx
│ │ ├── CategoryHub.jsx
│ │ ├── ContentDetail.jsx
│ │ ├── Search.jsx
│ │ ├── Cart.jsx
│ │ ├── Bookmarks.jsx
│ │ ├── Releases.jsx
│ │ ├── Trailers.jsx
│ │ ├── About.jsx
│ │ └── Contact.jsx
│ │
│ ├── hooks/ # Custom React hooks
│ │ ├── useData.js # Preloaded JSON fetch
│ │ ├── useBookmark.js # localStorage bookmarks
│ │ ├── useLegalImage.js # TMDb/Wikipedia fetch
│ │ └── useImages.js
│ │
│ ├── lib/ # Utility libraries
│ │ ├── legalImages.js # Copyright-safe image sources
│ │ ├── imageService.js
│ │ └── tmdb.js
│ │
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
---

## 🚀 Installation & Setup

### Prerequisites

| Tool | Minimum Version |
|------|-----------------|
| Node.js | v18+ (LTS) |
| npm | v9+ |
| Browser | Chrome / Firefox / Edge / Safari (latest) |

### Step 1 — Clone or Extract

```bash
# If you have the zip file
unzip fandomverse.zip
cd fandomverse

# Or if cloning from git
git clone <repository-url>
cd fandomverse