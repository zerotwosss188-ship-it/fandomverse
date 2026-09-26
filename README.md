# 🌌 FandomVerse — Portal for Fandom World

A unified, visually rich information hub for fans of **Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga**. Built as a **Single Page Application (SPA)** with **zero backend** — all content is served from pre-populated JSON files.

**Event:** TechWiz 7 — The World Tech Championship  
**Organizer:** Aptech Learning  
**Category:** Web Innovation Unleashed  
**Theme:** Fandom Universe  
**Submission Date:** 27 September 2026

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
├── netlify.toml
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

Step 2 — Install Dependencies
bash
npm install
Step 3 — Run Development Server
bash
npm run dev
Open http://localhost:5173 in your browser.

Step 4 — Build for Production
bash
npm run build
Output will be in the dist/ folder.

Step 5 — Preview Production Build
bash
npm run preview
📜 Available Scripts
Command	Description
npm run dev	Start Vite dev server with HMR
npm run build	Build optimized production bundle
npm run preview	Preview production build locally
npm run lint	Run oxlint on the codebase
📊 Data Files
All content lives in public/data/*.json. Each file follows a predictable schema:

File	Record Count	Primary Fields
content.json	246 articles	id, category, type, title, excerpt, body, image, banner, tags, date, popularity
characters.json	250+ profiles	id, category, name, series, bio, traits
events.json	80+ events	id, category, title, date, location, description, type, attendees
merchandise.json	55 items	id, category, series, name, price, description, type, image
trailers.json	120 trailers	id, category, title, youtubeId, releaseStatus, date
videos.json	119 videos	id, category, series, type, title, youtubeId, duration, channel
audio.json	80 clips	id, category, title, type, host, duration, audioUrl
galleries.json	80+ images	id, category, series, caption
releases.json	12 releases	id, title, date, category, type
chatbot.json	13 responses	keywords, reply, link
Data Editing
To add/edit content:

Open the relevant JSON file in public/data/

Add/modify the record

Save — Vite HMR will auto-reload

Note: The application is read-only — no runtime write-back to these files.

🧩 Key Modules
SmartImage.jsx
Handles image loading with automatic fallback:

Try maxresdefault.jpg (YouTube) → falls back to hqdefault.jpg

Try primary URL → falls back to local banner

Shows "Loading" pulse in rose color while fetching

Fades in smoothly on load

useData.js
Zero-CLS data hook — reads from window.__fvData (preloaded in main.jsx) before rendering, falling back to fetch only if needed.

useBookmark.js
Manages localStorage bookmarks:

Key: fv_bookmarks

Dispatches fv-bookmarks-update event

Integrates with toast system

useLegalImage.js
Copyright-safe image fetching with:

7-day localStorage cache

Multi-source fallback (TMDb → Kitsu → Wikipedia)

Variant index for unique images per article in same series

Chatbot.jsx
Rule-based VerseBot:

Loads chatbot.json on mount

Keyword matching for responses

Quick replies + typing indicator

Navigation links embedded in responses

🎨 Design System
Colors
Token	Value	Usage
--bg	#0a0a0a	Main background
--bg-2	#141414	Secondary surface
--primary	#e11d48	Rose red — CTAs, accents
--accent	#a855f7	Violet — gradients, hover glow
--text	#f5f5f5	Primary text
--text-dim	#b8b8b8	Muted text
--border	rgba(255,255,255,0.08)	Subtle borders
Typography
Headings: Orbitron (700–900)

Body: Space Grotesk (400–600)

Fluid scaling: clamp() for responsive font sizes

Motion
Framer Motion for page transitions, hover effects, modal animations

CSS keyframes for ambient effects (glow, float, shimmer, ticker)

Reduced-motion respected — heavy animations disabled when preferred

📱 Responsive Breakpoints
Breakpoint	Width	Layout
Mobile	320–639px	1–2 column grids, stacked nav
Tablet	640–1023px	2–3 column grids
Laptop	1024–1439px	4–5 column grids
Desktop	1440–1919px	5–6 column grids
2K	1920–2559px	6–7 column grids
4K	2560px+	7–8 column grids, wider containers
All typography, spacing, and grid columns use clamp() for fluid adaptation.

⚠️ Constraints & Assumptions
Constraints (per SRS)
❌ No backend server — all logic runs client-side

❌ No database — JSON files serve as data source

❌ No write-back — the app cannot modify JSON files at runtime

❌ No live external AI — chatbot uses rule-based dataset

❌ No copyrighted content — only AI-generated, public API, or royalty-free assets

Assumptions
Storage: Only localStorage and sessionStorage are used for user data. No server persistence.

APIs: TMDb, Kitsu, Wikipedia, AniList, and SoundHelix are assumed accessible during demo. Fallback to local images if they fail.

Browsers: Modern evergreen browsers only (Chrome, Firefox, Edge, Safari). No IE support.

Screen sizes: 360px → 3840px tested via Chrome DevTools.

Auth: Login/Signup buttons are UI-only — no real authentication.

Cart: Temporary only — no checkout, no payment (per SRS).

Content: Articles/bios/events written with AI assistance and team curation. No direct quotes from copyrighted sources.

Images: AI-generated (ChatGPT, Gemini) or sourced from public APIs with attribution. Footer credits all sources.

Accessibility: Keyboard-navigable, skip-to-content link, focus-visible outlines, ARIA labels where relevant.

Deployment: Netlify with netlify.toml SPA redirect rules.

🤖 AI Tools Acknowledged
In accordance with SRS Page 14, the following AI tools were used as supporting aids — not as substitutes for original work:

Tool	Purpose
DeepSeek Chat (Free)	Full-code development assistance — React components, CSS responsive design, debugging, documentation drafting
ChatGPT	AI-generated visual assets (banners, thumbnails), content drafting for articles and bios
Gemini	AI-generated visual assets (merchandise, gallery), content refinement
Scope of Use:

✅ Code assistance (debugging, patterns, fluid CSS)

✅ Image generation (permitted per SRS Page 14)

✅ Content generation (later curated by team)

✅ Rule-based chatbot dataset (edited for tone)

✅ Documentation drafting

What AI Was NOT Used For:

❌ No full boilerplate templates

❌ No AI code submitted without review

❌ No copyrighted content reproduced

❌ No live AI service in final app

The final implementation reflects the team's own understanding of React, Vite, responsive CSS, and client-side architecture. All code can be explained and justified during evaluation.

👥 Team
Role	Member	Responsibilities
Frontend Developer	[ StudentID: 1730851 - MUHAMAD ASBER ALI BIN SAADI , StudentID:1729035 - FARHAN AHMED KHAN ]	React components, routing, state management
UI/UX Designer	[ StudentID1730490 - MANAHIL ASHRAF , StudentID:1726465 -MALAIKA IFTIKHAR , StudentID: 1730851 - MUHAMAD ASBER ALI BIN SAADI ]	Visual design, responsive layouts, animations
Content Curator	[ StudentID: 1730851 - MUHAMAD ASBER ALI BIN SAADI , StudentID:1729035 - FARHAN AHMED KHAN , StudentID1730490 - MANAHIL ASHRAF , StudentID:1726465 -MALAIKA IFTIKHAR ]	JSON data, character bios, article drafting
QA & Testing	[ StudentID: 1730851 - MUHAMAD ASBER ALI BIN SAADI ]	Cross-browser testing, accessibility audit

📄 License & Rights
This project is submitted as a non-commercial educational project under the TechWiz 7 — The World Tech Championship (Aptech Learning).

Attribution:

TMDb — Movie/TV imagery (footer credit)

Kitsu.io — Anime/manga covers

AniList — Anime banner images

Wikipedia / Wikimedia Commons — Character and series reference images

YouTube — Embedded trailers and videos via official embed API

SoundHelix — Royalty-free audio samples

Unsplash — Royalty-free hero imagery

ChatGPT / Gemini — AI-generated visual assets

All trademarks, character designs, and franchise names belong to their respective owners. No commercial use is intended.

🚀 Deployment
Live URL
🌐 https://fandoms.netlify.app/
🌐 https://fandomverse-hub.vercel.app/

Netlify Config (netlify.toml)
toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
Deploy Steps
Push code to GitHub

Connect GitHub repo to Netlify

Set build command: npm run build

Set publish directory: dist

Deploy

The [[redirects]] rule ensures SPA routing works on direct URL access (e.g. /category/anime).

📚 References
React 19 Documentation

Vite 8 Guide

React Router 7

Framer Motion

Tailwind CSS 3

TMDb API

AniList GraphQL

Kitsu API

Netlify Docs

📞 Contact
For questions or feedback:

Email: hello@fandomverse.dev

GitHub: github.com/zerotwosss188-ship-it/fandomverse

Live Site: fandomverse.netlify.app

© 2026 FandomVerse · Non-commercial educational project · All trademarks and character designs belong to their respective owners.

text

---

## 📋 Summary

Ye poora `README.md` hai — copy karke apni file replace kar do. Ismein sab kuch hai:

| Section | Included |
|---------|----------|
| Project Overview | ✅ |
| Problem & Solution | ✅ |
| Features (12 sections) | ✅ |
| Tech Stack | ✅ |
| Project Structure (full tree) | ✅ |
| Installation (5 steps) | ✅ |
| Available Scripts | ✅ |
| Data Files (all 10) | ✅ |
| Key Modules | ✅ |
| Design System | ✅ |
| Responsive Breakpoints | ✅ |
| Constraints & Assumptions | ✅ |
| **AI Tools Acknowledged** | ✅ (DeepSeek, ChatGPT, Gemini) |
| Team | ✅ (placeholder) |
| License & Rights | ✅ |
| Deployment | ✅ |
| References | ✅ |
| Contact | ✅ |
