"use client";

import { useState, useEffect } from "react";

const messages = [
  { text: "Truth cannot be silenced; Palestine cannot be forgotten", lang: "en" },
  { text: "حتى لو اتشالت من المابس مش هتتشال من القلوب", lang: "ar" },
  { text: "Every corner tells the story of truth and justice", lang: "en" },
  { text: "فلسطين في القلب دائماً", lang: "ar" },
  { text: "Justice will prevail", lang: "en" },
  { text: "الحق سيظهر مهما طال الزمن", lang: "ar" },
  { text: "From the river to the sea", lang: "en" },
  { text: "العودة حق لا يموت", lang: "ar" },
];

interface FloatingMessage {
  id: number;
  text: string;
  lang: string;
  x: number;
  y: number;
  delay: number;
}

export default function FloatingMessages() {
  const [activeMessages, setActiveMessages] = useState<FloatingMessage[]>([]);

  useEffect(() => {
    // Show 2-3 random messages at a time
    const showRandomMessages = () => {
      const count = Math.floor(Math.random() * 2) + 2; // 2-3 messages
      const shuffled = [...messages].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);
      
      const newMessages: FloatingMessage[] = selected.map((msg, index) => ({
        id: Date.now() + index,
        text: msg.text,
        lang: msg.lang,
        x: Math.random() * 70 + 10, // 10% to 80% of screen width
        y: Math.random() * 60 + 15, // 15% to 75% of screen height
        delay: index * 2000,
      }));

      setActiveMessages(newMessages);
    };

    showRandomMessages();
    
    // Rotate messages every 8 seconds
    const interval = setInterval(showRandomMessages, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="floating-messages-container" aria-hidden="true">
      {activeMessages.map((msg) => (
        <div
          key={msg.id}
          className={`floating-message floating-message-${msg.lang}`}
          style={{
            left: `${msg.x}%`,
            top: `${msg.y}%`,
            animationDelay: `${msg.delay}ms`,
          }}
        >
          <span className="floating-message-text">{msg.text}</span>
        </div>
      ))}
    </div>
  );
}
