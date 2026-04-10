"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after mount
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className={`footer ${isVisible ? "footer-visible" : ""}`}>
      <div className="footer-content">
        <p className="footer-text">
          Created by <span className="footer-name">Mohamed Rashidi</span>
        </p>
        <div className="footer-glow"></div>
      </div>
    </footer>
  );
}
