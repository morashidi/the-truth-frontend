"use client";

import { useState, useEffect } from "react";

interface PostCardProps {
  title: string;
  content: string;
  author: string;
  createdAt: string;
  image?: string;
  delay?: number;
}

export default function PostCard({ 
  title, 
  content, 
  author, 
  createdAt, 
  image,
  delay = 0 
}: PostCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <article className={`post-card ${isVisible ? "post-card-visible" : ""}`}>
      <div className="post-card-image-container">
        {!imgError && image ? (
          <>
            <img 
              src={image} 
              alt={title} 
              className="post-card-image" 
              onError={() => setImgError(true)}
            />
            <div className="post-card-image-overlay"></div>
          </>
        ) : (
          <div className="image-placeholder">
            <span className="image-placeholder-icon">🕊️</span>
            <span>Truth Prevails</span>
          </div>
        )}
      </div>
      <div className="post-card-content">
        <h3 className="post-card-title">{title}</h3>
        <p className="post-card-text">{content}</p>
        <div className="post-card-meta">
          <span className="post-card-author">{author}</span>
          <span className="post-card-date">{createdAt}</span>
        </div>
      </div>
    </article>
  );
}