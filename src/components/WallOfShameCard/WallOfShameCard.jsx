import React from 'react';
import styles from './WallOfShameCard.module.css';

const WallOfShameCard = ({ roast }) => {
  const { id, timeAgo, severity, idea, feasibilityScore, marketScore, summary } = roast;

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'ABSOLUTE GARBAGE':
        return styles.badgeEmber;
      case 'VIBE NONSENSE':
        return styles.badgeHazard;
      case 'ACTUALLY... OK?':
        return styles.badgeAcid;
      default:
        return styles.badgeHazard;
    }
  };

  const getBarColor = (score) => {
    if (score < 33) return 'var(--color-ember)';
    if (score < 66) return 'var(--color-hazard)';
    return 'var(--color-acid)';
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.id}>#{id}</span>
        <span className={styles.time}>{timeAgo}</span>
        <div className={`${styles.badge} ${getSeverityStyle(severity)}`}>
          {severity}
        </div>
      </div>
      
      <div className={styles.body}>
        <p className={styles.idea}>"{idea}"</p>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Feasibility</span>
            <span className={styles.metricValue}>{feasibilityScore}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ 
                width: `${feasibilityScore}%`, 
                backgroundColor: getBarColor(feasibilityScore) 
              }} 
            />
          </div>
        </div>
        
        <div className={styles.metric}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>Market</span>
            <span className={styles.metricValue}>{marketScore}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ 
                width: `${marketScore}%`, 
                backgroundColor: getBarColor(marketScore) 
              }} 
            />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.summary}>{summary}</p>
      </div>
    </div>
  );
};

export default WallOfShameCard;
