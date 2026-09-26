import { useEffect, useState } from 'react';

export function useData(file) {
  // If preloaded in window.__fvData, use it immediately — zero CLS
  const preloaded =
    typeof window !== 'undefined' && window.__fvData && window.__fvData[file];

  const [data, setData] = useState(preloaded || null);
  const [loading, setLoading] = useState(!preloaded);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (preloaded) {
      setData(preloaded);
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetch(`/data/${file}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${file}.json`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [file, preloaded]);

  return { data, loading, error };
}