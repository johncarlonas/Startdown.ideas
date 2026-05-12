import React, { useState, useEffect, useRef } from "react";
import styles from "./RoastInput.module.css";
import Modal from "../Modal/Modal";

const loadingMessages = [
  "Calculating market failure...",
  "Analyzing how much money you'll waste...",
  "Searching for your competitors (found 67)...",
  "Consulting the ghost of failed startups...",
  "Measuring delusion levels...",
  "Cross-referencing with Product Hunt graveyard...",
  "Checking if YC already rejected this...",
];

const RoastInput = () => {
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [currentRoast, setCurrentRoast] = useState(null);
  
  // Modal states
  const [modalState, setModalState] = useState({ type: null, isOpen: false });
  
  const feedbackZoneRef = useRef(null);
  const charCount = idea.length;

  useEffect(() => {
    let msgInterval;
    let progressInterval;

    if (status === "loading") {
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
            return 98; // Hold at 98% until fetch finishes
          }
          return next;
        });
      }, 150);
    }

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idea.trim() || idea.length < 10) return;

    setStatus("loading");
    setProgress(0);
    setMsgIndex(0);

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });

      if (!response.ok) throw new Error('AI Disgust');
      
      const roastData = await response.json();
      setCurrentRoast(roastData);
      
      setProgress(100);
      setTimeout(() => {
        setStatus("success");
        if (window.matchMedia("(max-width: 991px)").matches) {
          setTimeout(() => {
            const feedbackEl = feedbackZoneRef.current;
            if (!feedbackEl) return;
            const navHeight = document.querySelector("nav")?.offsetHeight || 0;
            const top = feedbackEl.getBoundingClientRect().top + window.scrollY - navHeight - 10;
            window.scrollTo({ top, behavior: "smooth" });
          }, 100);
        }
      }, 400); // Brief delay so user sees 100%

    } catch (err) {
      console.error(err);
      setStatus("idle");
      setModalState({ type: "error", isOpen: true });
    }
  };

  const handleShareClick = () => {
    setModalState({ type: "confirmShare", isOpen: true });
  };

  const confirmShare = async () => {
    if (!currentRoast) return;
    setModalState({ ...modalState, isOpen: false });
    
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentRoast, idea })
      });
      if (response.ok) {
        setModalState({ type: "successShare", isOpen: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setIdea("");
    setStatus("idle");
    setProgress(0);
    setCurrentRoast(null);
  };

  const getColorClass = (score) => {
    if (score < 40) return "Ember";
    if (score < 70) return "Hazard";
    return "Acid";
  };

  return (
    <>
    <section id="roast-input" className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.howSection}>
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
              <p className={styles.stepText}>Our AI analyzes 67 failure vectors in real time.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>03</span>
              <p className={styles.stepText}>Receive your brutal verdict. Cry. Pivot. Repeat.</p>
            </div>
          </div>
        </div>

        <div className={styles.columns}>
          <div className={styles.inputZone}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputHeader}>
                <span className={styles.inputLabel}>INPUT YOUR DELUSION</span>
                <span className={styles.charCount}>{charCount}/1000</span>
              </div>
              <textarea
                className={styles.textarea}
                placeholder="Explain your 'revolutionary' idea here..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                maxLength={1000}
                spellCheck={false}
                disabled={status !== "idle"}
              />
              <button type="submit" className={styles.roastBtn} disabled={status !== "idle"}>ROAST ME</button>
              <p className={styles.warning}><span className={styles.warningLabel}>WARNING:</span> May cause existential crisis.</p>
            </form>
          </div>

          <div ref={feedbackZoneRef} className={styles.feedbackZone}>
            {status === "idle" && (
              <div className={styles.feedbackPlaceholder}>
                <div className={styles.placeholderContent}>
                  <div className={styles.placeholderIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2C7.03 2 3 6.03 3 11V22H21V11C21 6.03 16.97 2 12 2Z" />
                      <path d="M9 14H15" /><path d="M12 11V17" />
                    </svg>
                  </div>
                  <h3 className={styles.placeholderTitle}>WAITING FOR THE VERDICT</h3>
                  <p className={styles.placeholderText}>This is where the end of your startup journey will appear.</p>
                </div>
              </div>
            )}

            {status === "loading" && (
              <div className={styles.loadingState}>
                <div className={styles.spinnerWrapper}><div className={styles.spinner}></div></div>
                <div className={styles.loadingMsgBox}><div className={styles.loadingMsg}>{loadingMessages[msgIndex]}</div></div>
                <div className={styles.loadingWarning}>[ <span className={styles.textHazard}>ANALYZING</span> 67 FAILURE VECTORS ]</div>
                <div className={styles.progressContainer}>
                  <progress className={styles.progressNative} value={progress} max="100" />
                  <div className={styles.progressLabels}><span>0%</span><span>{Math.floor(progress)}%</span></div>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className={styles.verdictContainer}>
                <div className={styles.roastSection}>
                  <div className={styles.roastHeaderRow}>
                    <div className={`${styles.sectionTitle} ${styles.sectionTitleTight}`}>THE VERDICT</div>
                    <div className={`${styles.verdictBadgeSmall} ${styles[`bg${currentRoast.badgeColor.charAt(0).toUpperCase() + currentRoast.badgeColor.slice(1)}`]}`}>
                      {currentRoast.verdictBadge}
                    </div>
                  </div>
                  <div className={styles.roastTextBox}>{currentRoast.roastText}</div>
                </div>

                <div className={styles.bottomSplit}>
                  <div className={styles.metricsColumn}>
                    <div className={styles.sectionTitle}>FAILURE METRICS</div>
                    <div className={styles.metricsList}>
                      {[
                        { label: "Feasibility", score: currentRoast.feasScore, note: currentRoast.feasNote },
                        { label: "Market Reach", score: currentRoast.marketScore, note: currentRoast.marketNote },
                        { label: "Originality", score: currentRoast.origScore, note: currentRoast.origNote }
                      ].map((m, i) => (
                        <div key={i} className={styles.metricItem}>
                          <div className={styles.metricHeaderCompressed}>
                            <div className={styles.metricLabelGroup}>
                              <div className={`${styles.dot} ${styles[`bg${getColorClass(m.score)}`]}`}></div>
                              <span>{m.label}</span>
                            </div>
                            <span className={styles.metricScoreCompressed}>{m.score}%</span>
                          </div>
                          <div className={styles.metricBarCompressed}>
                            <progress className={`${styles.metricProgress} ${styles[`metricProgress${getColorClass(m.score)}`]}`} value={m.score} max="100" />
                          </div>
                          <p className={styles.metricNoteCompressed}>{m.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.adviceColumn}>
                    <div className={styles.sectionTitle}>UNSOLICITED ADVICE</div>
                    <div className={styles.adviceGrid}>
                      {currentRoast.advice.map((adv, i) => (
                        <div key={i} className={styles.adviceBox}>
                          <div className={`${styles.adviceType} ${styles[`text${adv.color.charAt(0).toUpperCase() + adv.color.slice(1)}`]}`}>{adv.type}</div>
                          <div className={styles.adviceText}>{adv.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.actionsRow}>
                  <button className={styles.shareBtn} onClick={handleShareClick}>SHARE MY SHAME</button>
                  <button className={styles.retryBtn} onClick={handleReset}>TRY ANOTHER DELUSION</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    {/* Universal Modals */}
    <Modal 
      isOpen={modalState.isOpen && modalState.type === "error"} 
      type="error" 
      title="AI DISGUST (404)"
      onClose={() => window.location.reload()}
    >
      <p>The AI is too disgusted by your idea to respond. This level of delusion is literally not supported by the current API version.</p>
    </Modal>

    <Modal 
      isOpen={modalState.isOpen && modalState.type === "confirmShare"} 
      type="confirm" 
      title="PUBLIC HUMILIATION"
      confirmText="YES, EXPOSE ME"
      onConfirm={confirmShare}
      onClose={() => setModalState({ type: null, isOpen: false })}
    >
      <p>Are you sure you want to post this failure to the Wall of Shame for everyone to mock? There is no going back.</p>
    </Modal>

    <Modal 
      isOpen={modalState.isOpen && modalState.type === "successShare"} 
      type="success" 
      title="SHAME POSTED"
      onClose={() => setModalState({ type: null, isOpen: false })}
    >
      <p>Your shame has been successfully etched into the Wall of Shame. Happy failure!</p>
    </Modal>
    </>
  );
};

export default RoastInput;
