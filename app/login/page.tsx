"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import FloatingMessages from "@/components/FloatingMessages";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { login, error, clearError, isLoading } = useAuth();
  const { showToast } = useToast();

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    
    // Basic validation
    if (!email || !password) {
      setLocalError("Please fill in all fields");
      return;
    }
    
    try {
      await login(email, password);
      showToast("Welcome back! You are now logged in.", "success");
    } catch (err) {
      const errorMsg = error || "Login failed. Please try again.";
      showToast(errorMsg, "error");
    }
  };

  return (
    <main className="login-container">
      <FloatingMessages />
      <div className="login-box">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue</p>
        
        {(localError || error) && (
          <div className="login-error">{localError || error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don&apos;t have an account? <Link href="/register" className="login-link">Register</Link></p>
          <p><Link href="/" className="login-link">Back to Home</Link></p>
        </div>
      </div>
    </main>
  );
}
