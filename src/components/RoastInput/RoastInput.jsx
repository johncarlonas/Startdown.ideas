import React, { useState, useEffect, useRef } from 'react';
import styles from './RoastInput.module.css';
import { mockRoastResponses } from '../../data/dummyRoasts';

const loadingMessages = [
  'Calculating market failure...',
  'Analyzing how much money you\'ll waste...',
  'Searching for your competitors (found 47)...',
  'Consulting the ghost of failed startups...',
  'Measuring delusion levels...',
  'Cross-referencing with Product Hunt graveyard...',
  'Checking if YC already rejected this...',
];

const RoastInput = () => {
  const [idea, setIdea] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [currentRoast, setCurrentRoast] = useState(null);

  const charCount = idea.length;

  useEffect(() => {
    let msgInterval;
    let progressInterval;

    if (status === 'loading') {
      msgInterval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1400);

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const remaining = 100 - prev;
          const increment = Math.random() * Math.min(remaining * 0.3, 8) + 0.5;
          const next = prev + increment;
          if (next >= 98) {
            clearInterval(progressInterval);
            return 100;
          }
          return next;
        });
      }, 150);

      // Finish loading after 3 seconds
      setTimeout(() => {
        clearInterval(msgInterval);
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => setStatus('success'), 300);
      }, 3000);
    }

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, [status]);



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idea.trim() || idea.length < 10) return;
    setStatus('loading');
    setProgress(0);
    setMsgIndex(0);
    // Pick random roast
    const randomIndex = Math.floor(Math.random() * mockRoastResponses.length);
    setCurrentRoast(mockRoastResponses[randomIndex]);
  };

  const handleReset = () => {
    setIdea('');
    setStatus('idle');
    setProgress(0);
    setCurrentRoast(null);
  };

  const getBarColorClass = (score) => {
    if (score < 33) return styles.bgEmber;
    if (score < 66) return styles.bgHazard;
    return styles.bgAcid;
  };

  const getTextColorClass = (score) => {
    if (score < 33) return styles.textEmber;
    if (score < 66) return styles.textHazard;
    return styles.textAcid;
  };

  return (
    <section id="roast-input" className={styles.section}>
      <div className={styles.wrapper}>

        {/* HOW THIS WORKS - 3 steps row */}
        <div className={styles.howItWorks}>
          <h2 className={styles.howTitle}>HOW THIS WORKS</h2>
          <p className={styles.howSubtext}>
            Three simple steps to destroy your ego and save you from wasting your time.
          </p>
          <div className={styles.stepsRow}>
            <div className={styles.step}>
              <span className={styles.stepNum}>01</span>
              <p className={styles.stepText}>Describe your idea. Be as delusional as you want.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>02</span>
              <p className={styles.stepText}>Our AI analyzes 47 failure vectors in real time.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>03</span>
              <p className={styles.stepText}>Receive your brutal verdict. Cry. Pivot. Repeat.</p>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className={styles.columns}>

          {/* LEFT — Input zone */}
          <div className={styles.inputZone}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputHeader}>
                <span className={styles.inputLabel}>INPUT YOUR DELUSION</span>
                <span className={styles.charCount}>{charCount}/1000</span>
              </div>

              <textarea
                className={styles.textarea}
                placeholder="Explain your 'revolutionary' idea here... don't hold back, we certainly won't."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                maxLength={1000}
                spellCheck={false}
                disabled={status !== 'idle'}
              />

              <button 
                type="submit" 
                className={styles.roastBtn}
                disabled={status !== 'idle'}
              >
                ROAST ME
              </button>

              <p className={styles.warning}>
                <span className={styles.warningLabel}>WARNING:</span> May cause existential crisis.
              </p>
            </form>
          </div>

          {/* RIGHT — Feedback/Verdict panel */}
          <div className={styles.feedbackZone}>
            
            {status === 'idle' && (
              <div className={styles.feedbackPlaceholder}>
                {/* Empty placeholder */}
              </div>
            )}

            {status === 'loading' && (
              <div className={styles.loadingState}>
                <div className={styles.spinnerWrapper}>
                  <div className={styles.spinner}></div>
                </div>

                <div className={styles.loadingMsgBox}>
                  <div className={styles.loadingMsg}>{loadingMessages[msgIndex]}</div>
                </div>

                <div className={styles.loadingWarning}>
                  [ <span className={styles.textHazard}>ANALYZING</span> 47 FAILURE VECTORS ]
                </div>

                <div className={styles.progressContainer}>
                  <div className={styles.progressBarBg}>
                    <div 
                      className={styles.progressBarFill} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className={styles.progressLabels}>
                    <span>0%</span>
                    <span>{Math.floor(progress)}%</span>
                  </div>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className={styles.verdictContainer}>
                
                {/* Roast text */}
                <div className={styles.roastSection}>
                  <div className={styles.roastHeaderRow}>
                    <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>THE VERDICT</div>
                    <div className={`${styles.verdictBadgeSmall} ${styles[`bg${currentRoast.badgeColor.charAt(0).toUpperCase() + currentRoast.badgeColor.slice(1)}`]}`}>
                      {currentRoast.verdictBadge}
                    </div>
                  </div>
                  <div className={styles.roastTextBox}>
                    {currentRoast.roastText}
                  </div>
                </div>

                {/* Split Bottom Section */}
                <div className={styles.bottomSplit}>
                  
                  {/* LEFT: Metrics */}
                  <div className={styles.metricsColumn}>
                    <div className={styles.sectionTitle}>FAILURE METRICS</div>
                    
                    <div className={styles.metricsList}>
                      {/* Feasibility */}
                      <div className={styles.metricItem}>
                        <div className={styles.metricHeaderCompressed}>
                          <div className={styles.metricLabelGroup}>
                            <div className={`${styles.dot} ${styles.bgHazard}`}></div>
                            <span>Feasibility</span>
                          </div>
                          <span className={styles.metricScoreCompressed}>{currentRoast.feasScore}%</span>
                        </div>
                        <div className={styles.metricBarCompressed}>
                          <div className={`${styles.metricBarFillCompressed} ${styles.bgHazard}`} style={{ width: `${currentRoast.feasScore}%` }}></div>
                        </div>
                        <p className={styles.metricNoteCompressed}>{currentRoast.feasNote}</p>
                      </div>

                      {/* Market */}
                      <div className={styles.metricItem}>
                        <div className={styles.metricHeaderCompressed}>
                          <div className={styles.metricLabelGroup}>
                            <div className={`${styles.dot} ${styles.bgEmber}`}></div>
                            <span>Market Reach</span>
                          </div>
                          <span className={styles.metricScoreCompressed}>{currentRoast.marketScore}%</span>
                        </div>
                        <div className={styles.metricBarCompressed}>
                          <div className={`${styles.metricBarFillCompressed} ${styles.bgEmber}`} style={{ width: `${currentRoast.marketScore}%` }}></div>
                        </div>
                        <p className={styles.metricNoteCompressed}>{currentRoast.marketNote}</p>
                      </div>

                      {/* Originality */}
                      <div className={styles.metricItem}>
                        <div className={styles.metricHeaderCompressed}>
                          <div className={styles.metricLabelGroup}>
                            <div className={`${styles.dot} ${styles.bgAcid}`}></div>
                            <span>Originality</span>
                          </div>
                          <span className={styles.metricScoreCompressed}>{currentRoast.origScore}%</span>
                        </div>
                        <div className={styles.metricBarCompressed}>
                          <div className={`${styles.metricBarFillCompressed} ${styles.bgAcid}`} style={{ width: `${currentRoast.origScore}%` }}></div>
                        </div>
                        <p className={styles.metricNoteCompressed}>{currentRoast.origNote}</p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Unsolicited Advice */}
                  <div className={styles.adviceColumn}>
                    <div className={styles.sectionTitle}>UNSOLICITED ADVICE</div>
                    <div className={styles.adviceGrid}>
                      {currentRoast.advice.map((adv, idx) => (
                        <div key={idx} className={styles.adviceBox}>
                          <div className={`${styles.adviceType} ${styles[`text${adv.color.charAt(0).toUpperCase() + adv.color.slice(1)}`]}`}>
                            {adv.type}
                          </div>
                          <p className={styles.adviceText}>{adv.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Actions */}
                <div className={styles.actionsRow}>
                    <button className={styles.shareBtn}>
                      SHARE MY SHAME
                    </button>
                    <button className={styles.retryBtn} onClick={handleReset}>
                      ROAST ANOTHER IDEA
                    </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};

export default RoastInput;
