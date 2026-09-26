import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('fv_visitors') || '1024');
    const newCount = stored + 1;
    localStorage.setItem('fv_visitors', newCount);
    setCount(newCount);
  }, []);

  return (
    <div className="fv-chip">
      👥 {count.toLocaleString()} visitors
    </div>
  );
}