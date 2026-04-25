import React from 'react';
import styles from './WallOfShame.module.css';
import WallOfShameCard from '../WallOfShameCard/WallOfShameCard';
import { dummyRoasts } from '../../data/dummyRoasts';

const WallOfShame = () => {
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
          {dummyRoasts.map((roast) => (
            <WallOfShameCard key={roast.id} roast={roast} />
          ))}
        </div>

        <div className={styles.btnWrapper}>
          <a href="/trash-ideas" className={styles.viewAllBtn}>
            VIEW ALL TRASH IDEAS
          </a>
        </div>
      </div>
    </section>
  );
};

export default WallOfShame;
