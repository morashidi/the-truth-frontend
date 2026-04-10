"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import FloatingMessages from "@/components/FloatingMessages";
import { addPost } from "@/services/api";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  // Fade-in animation on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    
    if (title.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }
    
    if (content.length < 10) {
      setError("Content must be at least 10 characters");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        image: imageUrl.trim() || undefined,
      };
      
      await addPost(postData);
      
      // Success - show toast and redirect
      showToast("Post created successfully!, awaiting approval", "success");
      
      // Small delay to show toast before redirect
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      let errorMsg = err.response?.data?.message || "Failed to publish post. Please try again.";
      
      // Specific handling for auth errors
      if (err.response?.status === 401) {
        errorMsg = "Session expired or invalid. Please log in again.";
        // Redirect will happen automatically via interceptor
      }
      
      // Check if token exists
      const token = localStorage.getItem("token");
      console.log("[AddPost Error] Token exists:", !!token);
      console.log("[AddPost Error] Status:", err.response?.status);
      console.log("[AddPost Error] Message:", err.response?.data?.message);
      
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <main className="add-post-container">
        <div className="add-post-loading">
          <span className="loading-spinner"></span>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  // Don't render form if not logged in (will redirect)
  if (!isLoggedIn) {
    return (
      <main className="add-post-container">
        <div className="add-post-box">
          <p className="add-post-message">Please login to publish a post.</p>
          <Link href="/login" className="add-post-link">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="add-post-container">
      <FloatingMessages />
      <div className={`add-post-box ${isVisible ? "add-post-visible" : ""}`}>
        {/* Warning Message */}
        <div className="add-post-warning">
          <span className="add-post-warning-icon">⚠️</span>
          <p>Before you create any post, remember: we only accept the truth.</p>
        </div>

        <h1 className="add-post-title">Publish Truth</h1>
        
        {error && (
          <div className="add-post-error">
            <span className="add-post-error-icon">❌</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-post-form">
          <div className="add-post-group">
            <label htmlFor="title" className="add-post-label">
              Title <span className="add-post-required">*</span>
            </label>
            <input
              type="text"
              id="title"
              className="add-post-input"
              placeholder="Enter the title of your truth..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              disabled={isSubmitting}
            />
            <span className="add-post-char-count">{title.length}/100</span>
          </div>

          <div className="add-post-group">
            <label htmlFor="content" className="add-post-label">
              Content <span className="add-post-required">*</span>
            </label>
            <textarea
              id="content"
              className="add-post-textarea"
              placeholder="Share the truth that needs to be heard..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              disabled={isSubmitting}
            />
            <span className="add-post-char-count">{content.length} characters</span>
          </div>

          <div className="add-post-group">
            <label htmlFor="imageUrl" className="add-post-label">
              Image URL <span className="add-post-optional">(optional)</span>
            </label>
            <input
              type="url"
              id="imageUrl"
              className="add-post-input"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button 
            type="submit" 
            className="add-post-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Publishing...
              </>
            ) : (
              "Publish Truth"
            )}
          </button>
        </form>

        <div className="add-post-footer">
          <Link href="/" className="add-post-link">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
