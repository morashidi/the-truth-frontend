"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import FloatingMessages from "@/components/FloatingMessages";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { register, error, clearError, isLoading } = useAuth();
  const { showToast } = useToast();

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setLocalError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    
    try {
      await register(name, email, password);
      showToast("Account created! Please login.", "success");
    } catch (err) {
      const errorMsg = error || "Registration failed. Please try again.";
      showToast(errorMsg, "error");
    }
  };

  return (
    <main className="login-container">
      <FloatingMessages />
      <div className="login-box">
        <h1 className="login-title">Create Account</h1>
        <p className="login-subtitle">Join The Truth Platform</p>
        
        {(localError || error) && (
          <div className="login-error">{localError || error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              "Sign Up"
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Already have an account? <Link href="/login" className="login-link">Login</Link></p>
          <p><Link href="/" className="login-link">Back to Home</Link></p>
        </div>
      </div>
    </main>
  );
}
