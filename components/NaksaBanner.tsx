"use client";

import { useState } from "react";

export default function NaksaBanner() {
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  return (
    <div className="naksa-banner">
      {/* Main Image - Centered and Prominent */}
      <div className="naksa-banner-main">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYXHKZgk6aNw6cXpw4TDj4OTCajbZfTzq6Yg&s"
          alt="The Naksa 1967 - Historical Palestine"
          className={`naksa-main-image ${mainImageLoaded ? "loaded" : ""}`}
          onLoad={() => setMainImageLoaded(true)}
        />
      </div>

      {/* Palestinian flag — local SVG (hotlinked stock URLs often fail to load) */}
      <div className="naksa-flag-background" aria-hidden="true">
        <img
          src="/flags/palestine.svg"
          alt=""
          width={900}
          height={600}
          className="naksa-flag-background-image"
          loading="eager"
          decoding="async"
        />
      </div>
      <div className="naksa-overlay-blur" />

      {/* Text Content */}
      <div className="naksa-banner-content">
        <span className="naksa-badge">Voices of Truth</span>
        <h2 className="naksa-title">The Naksa 1967</h2>
        <p className="naksa-text">
          Truth cannot be erased.
          <br />
          Palestine cannot be forgotten.
          <br />
          <span className="naksa-text-sub">
            Every inch of this land carries history, identity, and a truth that refuses silence.
          </span>
        </p>
      </div>

      {/* Gradient Fade at Bottom for Seamless Integration */}
      <div className="naksa-banner-fade"></div>
    </div>
  );
}
