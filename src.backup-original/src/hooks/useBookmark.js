import { useState, useEffect } from 'react';

export function useBookmark({ id, title, type, category, image }) {
  const [bookmarked, setBookmarked] = useState(false);
  const itemType = type || 'article';
  const key = `${itemType}:${id}`;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('fv_bookmarks') || '[]');
      setBookmarked(
        Array.isArray(saved) &&
          saved.some((b) => `${b.type || 'article'}:${b.id}` === key)
      );
    } catch (err) {
      console.warn('useBookmark read error:', err);
      setBookmarked(false);
    }
  }, [key]);

  const toggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      const saved = JSON.parse(localStorage.getItem('fv_bookmarks') || '[]');
      const safeSaved = Array.isArray(saved) ? saved : [];

      let updated;
      if (bookmarked) {
        updated = safeSaved.filter(
          (b) => `${b.type || 'article'}:${b.id}` !== key
        );
      } else {
        updated = [
          ...safeSaved,
          { id, title, type: itemType, category, image: image || null },
        ];
      }

      localStorage.setItem('fv_bookmarks', JSON.stringify(updated));
      setBookmarked(!bookmarked);

      window.dispatchEvent(new Event('fv-bookmarks-update'));
      window.dispatchEvent(new Event('fv-bookmarks-new-count'));
      console.log('✅ Bookmark toggled:', key, 'now', updated.length, 'items');
    } catch (err) {
      console.error('❌ Bookmark toggle failed:', err);
    }
  };

  return { bookmarked, toggle };
}