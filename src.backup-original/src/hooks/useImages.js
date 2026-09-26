// src/hooks/useImages.js
import { useState, useEffect } from 'react';
import { getCharacterImage, getSeriesImage } from '../lib/imageService';

export function useCharacterImage(name, series, category, id) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let cancelled = false;
    getCharacterImage(name, series, category, id).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [name, series, category, id]);
  return url;
}

export function useSeriesImage(name, category) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let cancelled = false;
    getSeriesImage(name, category).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [name, category]);
  return url;
}