import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.container}>
        
        <div className={styles.tagWrapper}>
          <div className={styles.tag}>
            <span className={styles.tagDot}></span>
            AI-POWERED DREAM DESTRUCTION
          </div>
        </div>

        <h1 className={styles.title}>
          Roasting Your <span className={styles.highlight}>"Million Dollar"</span><br />
          Ideas Until You Wake Up
        </h1>
        
        <p className={styles.subheader}>
          Let this platform crush your startup dreams before the market does.<br/>
          <span className={styles.subheaderSub}>No VC friends? No problem. We'll tell you the truth they won't.</span>
        </p>

        <div className={styles.actionWrapper}>
          <a href="#roast-input" className={styles.ctaBtn}>
            START ROASTING
          </a>
        </div>

        <hr className={styles.divider} />
        
        <div className={styles.stats}>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>99%</span>
            <span className={styles.statLabel}>Failure Rate</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>Feelings Spared</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>1M+</span>
            <span className={styles.statLabel}>Delusion Detected</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
