import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NewsTicker from './components/NewsTicker';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import CategoryHub from './pages/CategoryHub';
import ContentDetail from './pages/ContentDetail';
import Search from './pages/Search';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Bookmarks from './pages/Bookmarks';
import Releases from './pages/Releases';
import Trailers from './pages/Trailers';
import BookmarkToast from './components/BookmarkToast';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <a href="#main-content" className="fv-skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" style={{ minHeight: 'calc(100vh - 72px)' }}>
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