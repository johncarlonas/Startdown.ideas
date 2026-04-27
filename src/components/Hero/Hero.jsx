import React from "react";
import styles from "./Hero.module.css";

const Hero = () => {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.tagWrapper}>
          <div className={styles.tag}>
            <span className={styles.tagDot}></span>
            AI-POWERED DREAM DESTRUCTION
          </div>
        </div>

        <h1 className={styles.title}>
          <span className={styles.titleMobile}>
            <span className="glitch" data-text="Roasting Your">Roasting Your</span>
            <br />
            <span className="glitch" data-text='"Million Dollar" Ideas'>
              <span className={styles.highlight}>"Million Dollar"</span> Ideas
            </span>
            <br />
            <span className="glitch" data-text="Until You Wake Up">Until You Wake Up</span>
          </span>

          <span className={styles.titleDesktop}>
            <span className="glitch" data-text='Roasting Your "Million Dollar"'>
              Roasting Your <span className={styles.highlight}>"Million Dollar"</span>
            </span>
            <br />
            <span className="glitch" data-text="Ideas Until You Wake Up">
              Ideas Until You Wake Up
            </span>
          </span>
        </h1>

        <p className={styles.subheader}>
          <span className={styles.subheaderMain}>
            Let this platform crush your startup dreams before the market does.
          </span>
          <br />
          <span className={styles.subheaderSub}>
            No VC friends? No problem. We'll tell you the truth they won't.
          </span>
        </p>

        <div className={styles.actionWrapper}>
          <a
            href="#roast-input"
            className={styles.ctaBtn}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("roast-input");
              if (el) {
                const navHeight =
                  document.querySelector("nav")?.offsetHeight || 0;
                const top =
                  el.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
          >
            START ROASTING
          </a>
        </div>

        <hr className={styles.divider} />

        <div className={styles.stats}>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>99%</span>
            <span className={styles.statLabel}>Failure Rate</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>0</span>
            <span className={styles.statLabel}>Feelings Spared</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>1M+</span>
            <span className={styles.statLabel}>Delusion Detected</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
