import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { label: 'HOME', href: '#hero' },
  { label: 'WALL OF SHAME', href: '#wall-of-shame' },
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('#hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => item.href.replace('#', ''));
      let current = '#hero';

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            current = `#${id}`;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}></div>
          <span className={styles.logoText}>Startdown<span className={styles.logoHighlight}>.fail</span></span>
        </div>
        
        <div className={styles.navLinks}>
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.link} ${activeSection === item.href ? styles.active : ''}`}
            >
              {item.label}
            </a>
          ))}
          <button className={styles.loginBtn}>LOG IN</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
