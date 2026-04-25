import React from 'react';
import styles from './WallOfShameCard.module.css';

const WallOfShameCard = ({ roast }) => {
  const { timeAgo, severity, idea, feasibilityScore, feasibilityComment, marketScore, marketComment, originalityScore, originalityComment, summary } = roast;

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

  const getBarColorClass = (score) => {
    if (score < 33) return styles.dotEmber;
    if (score < 66) return styles.dotHazard;
    return styles.dotAcid;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.profileIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <span className={styles.time}>{timeAgo}</span>
        <div className={`${styles.badge} ${getSeverityStyle(severity)}`}>
          {severity}
        </div>
      </div>
      
      <div className={styles.body}>
        <p className={styles.idea}>{idea}</p>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>
              <span className={`${styles.dot} ${getBarColorClass(feasibilityScore)}`}></span>
              Feasibility
            </span>
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
          <span className={styles.metricComment}>{feasibilityComment}</span>
        </div>
        
        <div className={styles.metric}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>
              <span className={`${styles.dot} ${getBarColorClass(marketScore)}`}></span>
              Market Reach
            </span>
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
          <span className={styles.metricComment}>{marketComment}</span>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricHeader}>
            <span className={styles.metricLabel}>
              <span className={`${styles.dot} ${getBarColorClass(originalityScore)}`}></span>
              Originality
            </span>
            <span className={styles.metricValue}>{originalityScore}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ 
                width: `${originalityScore}%`, 
                backgroundColor: getBarColor(originalityScore) 
              }} 
            />
          </div>
          <span className={styles.metricComment}>{originalityComment}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.summary}>{summary}</p>
      </div>
    </div>
  );
};

export default WallOfShameCard;
