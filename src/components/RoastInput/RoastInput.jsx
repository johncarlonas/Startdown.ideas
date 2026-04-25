import React, { useState } from 'react';
import styles from './RoastInput.module.css';

const RoastInput = () => {
  const [idea, setIdea] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    // Just a placeholder for the future AI integration
    console.log("Submitting idea for roasting:", idea);
    setIdea('');
  };

  return (
    <section id="roast-input" className={styles.section}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            className={styles.textarea}
            placeholder="Describe your 'revolutionary' startup idea here..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={5}
          />
          
          <div className={styles.actionArea}>
            <button type="submit" className={styles.button}>
              ROAST ME
            </button>
            <p className={styles.warning}>
              WARNING: May cause existential crisis.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RoastInput;
