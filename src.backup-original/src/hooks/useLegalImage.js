// src/hooks/useLegalImage.js
import { useState, useEffect } from 'react';
import { getLegalImage, getLegalImages } from '../lib/legalImages';

/**
 * variantIndex = 0 → original single-image behavior
 * variantIndex > 0 → pick a different image from the series pool
 */
export function useLegalImage(category, title, series, fallbackImage, variantIndex = 0) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!category || !title) {
      setUrl(fallbackImage || null);
      return;
    }

    let cancelled = false;
    const delay = Math.random() * 250;

    const timer = setTimeout(() => {
      const run = async () => {
        try {
          if (variantIndex === 0) {
            const single = await getLegalImage(category, title, series);
            return single ? [single] : [];
          }
          return await getLegalImages(category, title, series, Math.max(variantIndex + 4, 10));
        } catch {
          return [];
        }
      };

      run()
        .then((list) => {
          if (cancelled) return;
          if (!list || !list.length) {
            setUrl(fallbackImage || null);
            return;
          }
          const idx = Math.min(variantIndex, list.length - 1);
          setUrl(list[idx] || fallbackImage || null);
        })
        .catch(() => {
          if (!cancelled) setUrl(fallbackImage || null);
        });
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [category, title, series, fallbackImage, variantIndex]);

  return { url, loading: false };
}