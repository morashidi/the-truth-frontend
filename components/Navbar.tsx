"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo / Brand */}
        <Link href="/" className="navbar-logo">
          The Truth Platform
        </Link>

        {/* Desktop Links */}
        <ul className="navbar-links">
          <li>
            <Link href="/" className="navbar-link">
              Home
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link href="/add-post" className="navbar-link navbar-link-green">
                  Add Post
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="navbar-link navbar-link-logout"
                  disabled={isLoading}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="navbar-link">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="navbar-link navbar-link-green">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile ${isOpen ? "show" : ""}`}>
        <ul className="navbar-links">
          <li>
            <Link href="/" className="navbar-link" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link href="/add-post" className="navbar-link navbar-link-green" onClick={() => setIsOpen(false)}>
                  Add Post
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="navbar-link navbar-link-logout"
                  disabled={isLoading}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="navbar-link" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="navbar-link navbar-link-green" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}