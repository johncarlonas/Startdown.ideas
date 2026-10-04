import { useState, useEffect } from 'react';
import styles from './WallOfShame.module.css';
import WallOfShameCard from '../WallOfShameCard/WallOfShameCard';

function readPage(data, limit, offset = 0) {
  // A running development server may still return the previous array format.
  if (Array.isArray(data)) return {
    roasts: data.slice(offset, offset + limit),
    hasMore: data.length > offset + limit,
    nextOffset: offset + Math.min(limit, Math.max(0, data.length - offset))
  };
  if (!data || !Array.isArray(data.roasts)) throw new Error('The wall returned an unexpected response. Restart the backend and try again.');
  return data;
}

const WallOfShame = ({ preview = false }) => {
  const [page, setPage] = useState({ roasts: [], hasMore: false, nextOffset: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const limit = preview ? 3 : 12;
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/wall?limit=${limit}`, { signal: controller.signal })
      .then(async res => { const data = await res.json(); if (!res.ok) throw new Error(data.error); return data; })
      .then(data => { setPage(readPage(data, limit)); setError(''); })
      .catch(err => { if (!controller.signal.aborted) setError(err.message || 'Unable to load the wall.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [limit, attempt]);
  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/wall?limit=${limit}&offset=${page.nextOffset}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const next = readPage(data, limit, page.nextOffset);
      setPage(prev => ({ ...next, roasts: [...prev.roasts, ...next.roasts.filter(item => !prev.roasts.some(old => old.id === item.id))] }));
    } catch (err) { setError(err.message || 'Unable to load more.'); }
    finally { setLoading(false); }
  };
  const Title = preview ? 'h2' : 'h1';
  return (
    <section id="wall-of-shame" className={`${styles.section} ${!preview ? styles.page : ''}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Title className={styles.title}>Wall of Shame</Title>
          <p className={styles.subtext}>Ideas with 100% raw passion, 0% chance of making a single dime.</p>
          {!preview && <a href="/#roast-input" className={styles.viewAllBtn}>ROAST YOUR IDEA</a>}
        </div>
        <div className={styles.grid}>{page.roasts.map(roast => <WallOfShameCard key={roast.id} roast={roast} />)}</div>
        {loading && <p role="status">Loading shame...</p>}
        {!loading && !error && !page.roasts.length && <p>No shame posted yet. Yours could be the first.</p>}
        {error && <p role="alert">{error} <button onClick={() => page.roasts.length ? loadMore() : setAttempt(n => n + 1)}>Try again</button></p>}
        <div className={styles.btnWrapper}>
          {preview ? <a href="/wall-of-shame" className={styles.viewAllBtn}>SHOW MORE SHAME</a>
            : page.hasMore && <button disabled={loading} onClick={loadMore} className={styles.viewAllBtn}>{loading ? 'LOADING...' : 'LOAD MORE TRASH'}</button>}
        </div>
      </div>
    </section>
  );
};
export default WallOfShame;
