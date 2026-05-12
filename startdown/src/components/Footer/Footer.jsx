import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        © 2026 <span className={styles.highlight}>Startdown.ideas</span> — All
        Dreams Crushed with <span className={styles.heart}>❤︎❤︎❤︎</span>
      </div>
    </footer>
  );
};

export default Footer;
