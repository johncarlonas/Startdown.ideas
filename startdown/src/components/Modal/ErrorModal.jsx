import React from "react";
import styles from "./Modal.module.css";

const ErrorModal = ({ isOpen, errorDetails }) => {
  if (!isOpen) return null;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={styles.overlay} style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999 }}>
      <div className={styles.modal} style={{ border: '2px solid #FF3C3C', position: 'relative' }}>
        <div className={styles.iconWrapper} style={{ color: '#FF3C3C', marginBottom: '1rem' }}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '48px', height: '48px' }}
          >
             <circle cx="12" cy="12" r="10" />
             <line x1="15" y1="9" x2="9" y2="15" />
             <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        <h2 className={styles.title} style={{ color: '#FF3C3C', fontSize: '1.5rem', textTransform: 'uppercase' }}>
          AI DISGUST DETECTED
        </h2>
        <p className={styles.content} style={{ margin: '1.5rem 0', color: '#F5F5F0' }}>
          {errorDetails || "The AI is too disgusted by your idea to respond. You've either hit the rate limit or your idea is so bad it broke the API."}
        </p>

        <button 
          className={styles.closeBtn} 
          onClick={handleRefresh}
          style={{ 
            backgroundColor: '#FF3C3C', 
            border: 'none', 
            color: '#000',
            fontWeight: 'bold',
            padding: '12px 24px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          SORRY, I'LL TRY AGAIN
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
