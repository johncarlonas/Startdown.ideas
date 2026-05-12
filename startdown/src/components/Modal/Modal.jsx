import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  children, 
  confirmText,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrapper}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.icon}
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h2 className={styles.title}>
          <span className={styles.alertPrefix}>ALERT:</span> {title || "ANOTHER DELUSION DETECTED"}
        </h2>
        
        <div className={styles.content}>
          {content ? <p>{content}</p> : children}
        </div>

        <div className={styles.actionsRow}>
          {onConfirm ? (
            <>
              <button className={styles.confirmBtn} onClick={onConfirm}>
                {confirmText || "YES, EXPOSE ME"}
              </button>
              <button className={styles.cancelBtnClipped} onClick={onClose}>
                CANCEL
              </button>
            </>
          ) : (
            <button className={styles.confirmBtn} onClick={onClose}>
              {confirmText || "I'M DUMB, BUT I GET IT"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
