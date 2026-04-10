"use client";

import { useState } from "react";

export default function VoicesOfTruthBanner() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="voices-banner">
      {/* Main Background Image */}
      <div className="voices-banner-bg">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTksb-aKIFpq75XDQ5JWVkfH-DdeeaLOPkpyA&s"
          alt="From the River to the Sea - Palestine"
          className={`voices-bg-image ${imageLoaded ? "loaded" : ""}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Text Content with Solid Black Background */}
      <div className="voices-banner-content">
        <div className="voices-text-bg"></div>
        <div className="voices-text-wrapper">
          <span className="voices-badge">Voices of Truth</span>
          <h2 className="voices-title">From the River to the Sea</h2>
          <div className="voices-quote">
            <p className="voices-quote-line">Truth cannot be erased.</p>
            <p className="voices-quote-line">Palestine cannot be forgotten.</p>
          </div>
        </div>
      </div>

      {/* Bottom Fade for Seamless Integration */}
      <div className="voices-banner-fade"></div>
    </div>
  );
}
