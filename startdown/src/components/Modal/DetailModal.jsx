import React from "react";
import useDialog from "./useDialog";
import styles from "./DetailModal.module.css";

const DetailModal = ({ isOpen, onClose, roast }) => {
  const dialogRef = useDialog(isOpen, onClose);
  if (!isOpen || !roast) return null;

  const {
    verdictBadge,
    badgeColor,
    idea,
    feasScore,
    feasNote,
    marketScore,
    marketNote,
    origScore,
    origNote,
    roastText,
    advice
  } = roast;

  const getTitleColor = () => {
    switch (badgeColor) {
      case "ember": return "#FF3C3C";
      case "hazard": return "#FFE600";
      case "acid": return "#39FF14";
      default: return "#FFE600";
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={roast.verdictBadge} tabIndex={-1} className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title} style={{ color: getTitleColor() }}>
            {verdictBadge}
          </h2>
          <button className={styles.closeIcon} aria-label="Close verdict" onClick={onClose}>&times;</button>
        </div>

        <div className={styles.scrollArea}>
          <div className={styles.section}>
            <h4 className={styles.label}>THE IDEA</h4>
            <p className={styles.ideaText}>"{idea}"</p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.label}>THE ROAST</h4>
            <p className={styles.roastText}>{roastText}</p>
          </div>

          <div className={styles.metricsAdviceStack}>
            {/* Metrics Section */}
            <div className={styles.subSection}>
              <h4 className={styles.label}>FAILURE METRICS</h4>
              <div className={styles.metricsList}>
                {[
                  { label: "Feasibility", score: feasScore, note: feasNote },
                  { label: "Market Reach", score: marketScore, note: marketNote },
                  { label: "Originality", score: origScore, note: origNote }
                ].map((m, i) => (
                  <div key={i} className={styles.metricItem}>
                    <div className={styles.metricHead}>
                      <span>{m.label}</span>
                      <span>{m.score}%</span>
                    </div>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.barFill} 
                        style={{ 
                          width: `${m.score}%`, 
                          backgroundColor: m.score < 40 ? "#FF3C3C" : m.score < 70 ? "#FFE600" : "#39FF14" 
                        }} 
                      />
                    </div>
                    <p className={styles.metricNote}>{m.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice Section */}
            <div className={styles.subSection}>
              <h4 className={styles.label}>UNSOLICITED ADVICE</h4>
              <div className={styles.adviceList}>
                {advice.map((adv, i) => (
                  <div key={i} className={styles.adviceItem} style={{ borderLeftColor: adv.color === 'ember' ? '#FF3C3C' : adv.color === 'hazard' ? '#FFE600' : '#39FF14' }}>
                    <div className={styles.adviceType} style={{ color: adv.color === 'ember' ? '#FF3C3C' : adv.color === 'hazard' ? '#FFE600' : '#39FF14' }}>{adv.type}</div>
                    <div className={styles.adviceText}>{adv.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.closeBtn} onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
