import React, { useState, useEffect } from 'react';
import styles from './WallOfShame.module.css';
import WallOfShameCard from '../WallOfShameCard/WallOfShameCard';

const WallOfShame = () => {
  const [roasts, setRoasts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    fetch(`/api/wall`)
      .then(res => res.json())
      .then(data => setRoasts(data))
      .catch(err => console.error('Error fetching wall:', err));
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  return (
    <section id="wall-of-shame" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Wall of Shame</h2>
          <p className={styles.subtext}>
            Ideas with 100% raw passion, 0% chance of making a single dime.
          </p>
        </div>
        
        <div className={styles.grid}>
          {roasts
            .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
            .slice(0, visibleCount)
            .map((roast) => (
              <WallOfShameCard key={roast.id} roast={roast} />
            ))}
        </div>

        {visibleCount < roasts.length && (
          <div className={styles.btnWrapper}>
            <button onClick={handleLoadMore} className={styles.viewAllBtn}>
              LOAD MORE TRASH
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WallOfShame;
