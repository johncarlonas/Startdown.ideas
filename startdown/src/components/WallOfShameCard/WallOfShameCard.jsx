import React, { useState } from "react";
import styles from "./WallOfShameCard.module.css";
import DetailModal from "../Modal/DetailModal";

const WallOfShameCard = ({ roast }) => {
  const {
    timestamp,
    verdictBadge,
    badgeColor,
    idea,
    feasScore,
    marketScore,
    origScore,
    roastText
  } = roast;

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const timeDisplay = timestamp ? new Date(timestamp).toLocaleDateString() : "Just now";

  const getBadgeStyle = (color) => {
    switch (color) {
      case "ember": return styles.badgeEmber;
      case "hazard": return styles.badgeHazard;
      case "acid": return styles.badgeAcid;
      default: return styles.badgeHazard;
    }
  };

  const getColorHex = (color) => {
    switch (color) {
      case "ember": return "#FF3C3C";
      case "hazard": return "#FFE600";
      case "acid": return "#39FF14";
      default: return "#FFE600";
    }
  };

  const getScoreColor = (score) => {
    if (score < 40) return "ember";
    if (score < 70) return "hazard";
    return "acid";
  };

  return (
    <>
      <div role="button" tabIndex={0} aria-label={`Read verdict: ${verdictBadge}`} onKeyDown={e => { if (["Enter", " "].includes(e.key)) { e.preventDefault(); setIsDetailOpen(true); } }} className={styles.card} onClick={() => setIsDetailOpen(true)}>
        <div className={styles.header}>
          <div className={styles.profileIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className={styles.time}>{timeDisplay}</span>
          <div className={`${styles.badge} ${getBadgeStyle(badgeColor)}`}>
            {verdictBadge}
          </div>
        </div>

        <div className={styles.body}>
          <p className={styles.idea}>{idea}</p>
        </div>

        <div className={styles.metrics}>
          {[
            { label: "Feasibility", score: feasScore },
            { label: "Market Reach", score: marketScore },
            { label: "Originality", score: origScore }
          ].map((m, i) => (
            <div key={i} className={styles.metric}>
              <div className={styles.metricHeader}>
                <span className={styles.metricLabel}>
                  <span className={styles.dot} style={{ backgroundColor: getColorHex(getScoreColor(m.score)) }} />
                  {m.label}
                </span>
                <span className={styles.metricValue}>{m.score}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ 
                    width: `${m.score}%`, 
                    backgroundColor: getColorHex(getScoreColor(m.score)) 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <p className={styles.summary}>{roastText}</p>
          <span className={styles.viewMore}>CLICK TO SEE FULL DEVASTATION</span>
        </div>
      </div>

      {/* Detail Modal (Now a separate component) */}
      <DetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        roast={roast}
      />
    </>
  );
};

export default WallOfShameCard;
