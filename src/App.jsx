import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NewsTicker from './components/NewsTicker';
import Chatbot from './components/Chatbot';
import ScrollToTop from './components/ScrollToTop';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const CategoryHub = lazy(() => import('./pages/CategoryHub'));
const ContentDetail = lazy(() => import('./pages/ContentDetail'));
const Search = lazy(() => import('./pages/Search'));
const Cart = lazy(() => import('./pages/Cart'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const Releases = lazy(() => import('./pages/Releases'));
const Trailers = lazy(() => import('./pages/Trailers'));
import BookmarkToast from './components/BookmarkToast';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <a href="#main-content" className="fv-skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" style={{ minHeight: 'calc(100vh - 72px)' }}>
          <Suspense fallback={
            <div style={{
              display: 'grid',
              placeItems: 'center',
              minHeight: '60vh',
              color: '#e11d48',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 14,
              letterSpacing: '0.1em',
            }}>
              LOADING...
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:slug" element={<CategoryHub />} />
              <Route path="/content/:id" element={<ContentDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/releases" element={<Releases />} />
              <Route path="/trailers" element={<Trailers />} />
            </Routes>
          </Suspense>
        </main>
        <div style={{ marginTop: 60 }}>
          <NewsTicker />
        </div>
        <Footer />
        <Chatbot />
        <BookmarkToast />
      </div>
    </BrowserRouter>
  );
}