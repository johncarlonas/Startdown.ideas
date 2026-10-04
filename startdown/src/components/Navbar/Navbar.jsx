import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import Modal from "../Modal/Modal";

const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "WALL OF SHAME", href: "/wall-of-shame" },
];

const Navbar = () => {
  const activeSection = window.location.pathname.replace(/\/$/, "") === "/wall-of-shame" ? "/wall-of-shame" : "/";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <a href="/" className={styles.logoArea} aria-label="Startdown home">
          <span className={styles.logoText}>
            Startdown<span className={styles.dot}>.</span>
            <span className={styles.logoHighlight}>ideas</span>
          </span>
        </a>

        <button
          type="button"
          className={styles.hamburgerMenu}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-panel"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        <div className={styles.desktopNavLinks}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.link} ${activeSection === item.href ? styles.active : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button
            className={styles.loginBtn}
            onClick={() => setIsModalOpen(true)}
          >
            LOG IN
          </button>
        </div>

        <div
          id="mobile-nav-panel"
          className={`${styles.mobilePanel} ${isMobileMenuOpen ? styles.mobilePanelOpen : ""}`}
        >
          <div className={styles.mobileNavLinks}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`${styles.link} ${activeSection === item.href ? styles.active : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              className={styles.loginBtn}
              onClick={() => {
                setIsModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              LOG IN
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content="An account? For what? Your idea is already a public tragedy. Don't worry, I’m archiving your shame for your next catastrophic failure."
      />
    </nav>
  );
};

export default Navbar;
